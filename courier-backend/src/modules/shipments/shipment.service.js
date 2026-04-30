import Shipment from "./shipment.model.js";
import * as statusHistory from "../status-history/statusHistory.service.js";
import { getAdapter } from "../provider/provider.factory.js";
import { paginate } from "../../utils/pagination.util.js";
import Settings from "../settings/settings.model.js";

export const createShipment = async (data, userId) => {
    const settings = await Settings.findOne().lean();
    const keys     = settings?.providerKeys?.[data.provider] || {};
    const adapter  = getAdapter(data.provider, keys);
    const booking  = await adapter.bookShipment(data);

    const shipment = await Shipment.create({
        ...data,
        createdBy:          userId,
        providerTrackingNo: booking.trackingNo,
        providerRef:        booking.providerRef || null,
        status:             "booked",
    });

    await statusHistory.log(shipment._id, "booked", userId, "Shipment created");
    return shipment.toObject();
};

export const getShipments = async (query = {}) => {
    const filter = {};

    if (query.status)   filter.status   = query.status;
    if (query.provider) filter.provider = query.provider;

    if (query.isCOD !== undefined) {
        filter.isCOD = query.isCOD === "true";
    }

    if (query.consigneeCity) {
        filter["receiver.city"] = { $regex: query.consigneeCity, $options: "i" };
    }

    if (query.fromDate || query.toDate) {
        filter.createdAt = {};
        if (query.fromDate) filter.createdAt.$gte = new Date(query.fromDate);
        if (query.toDate)   filter.createdAt.$lte = new Date(query.toDate + "T23:59:59");
    }

    if (query.search) {
        filter.$or = [
            { "receiver.name":    { $regex: query.search, $options: "i" } },
            { "receiver.phone":   { $regex: query.search, $options: "i" } },
            { providerTrackingNo: { $regex: query.search, $options: "i" } },
        ];
    }

    return paginate(Shipment, filter, query);
};

export const getShipmentById = async (id) => {
    const shipment = await Shipment.findById(id).lean();
    if (!shipment) throw Object.assign(new Error("Shipment not found"), { status: 404 });
    return shipment;
};

export const getShipmentWithHistory = async (id) => {
    const shipment = await getShipmentById(id);
    const history  = await statusHistory.getHistory(id);
    return { ...shipment, history };
};

export const updateStatus = async (id, status, userId, note = "") => {
    const shipment = await Shipment.findByIdAndUpdate(
        id, { status }, { new: true }
    ).lean();
    if (!shipment) throw Object.assign(new Error("Shipment not found"), { status: 404 });
    await statusHistory.log(id, status, userId, note);
    return shipment;
};

export const cancelShipment = async (id, userId) => {
    const shipment = await Shipment.findById(id);
    if (!shipment) throw Object.assign(new Error("Shipment not found"), { status: 404 });

    if (["delivered", "cancelled"].includes(shipment.status)) {
        throw Object.assign(
            new Error("Cannot cancel a delivered or already cancelled shipment"),
            { status: 400 }
        );
    }

    const settings = await Settings.findOne().lean();
    const keys     = settings?.providerKeys?.[shipment.provider] || {};
    const adapter  = getAdapter(shipment.provider, keys);
    await adapter.cancelShipment(shipment.providerTrackingNo);

    return updateStatus(id, "cancelled", userId, "Cancelled by user");
};

export const getCourierAnalytics = async () => {
    return Shipment.aggregate([
        {
            $group: {
                _id:            "$provider",
                totalBooked:    { $sum: 1 },
                totalDelivered: { $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] } },
                totalFailed:    { $sum: { $cond: [{ $in: ["$status", ["failed", "cancelled"]] }, 1, 0] } },
                totalInTransit: { $sum: { $cond: [{ $in: ["$status", ["in_transit", "out_for_delivery", "received"]] }, 1, 0] } },
            },
        },
        {
            $project: {
                provider:       "$_id",
                _id:            0,
                totalBooked:    1,
                totalDelivered: 1,
                totalFailed:    1,
                totalInTransit: 1,
                deliveryRatio: {
                    $cond: [
                        { $eq: ["$totalBooked", 0] }, 0,
                        { $multiply: [{ $divide: ["$totalDelivered", "$totalBooked"] }, 100] },
                    ],
                },
                returnRatio: {
                    $cond: [
                        { $eq: ["$totalBooked", 0] }, 0,
                        { $multiply: [{ $divide: ["$totalFailed", "$totalBooked"] }, 100] },
                    ],
                },
            },
        },
        { $sort: { deliveryRatio: -1 } },
    ]);
};
