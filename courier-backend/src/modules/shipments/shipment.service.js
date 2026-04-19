const Shipment = require("./shipment.model");
const statusHistory = require("../status-history/statusHistory.service");
const { getAdapter } = require("../provider/provider.factory");
const { paginate } = require("../../utils/pagination.util");
const Settings = require("../settings/settings.model");

const createShipment = async (data, userId) => {
    // Load system-wide provider keys from single settings document
    const settings = await Settings.findOne().lean();
    const keys = settings?.providerKeys?.[data.provider] || {};
    const adapter = getAdapter(data.provider, keys);
    const booking = await adapter.bookShipment(data);

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

const getShipments = async (query = {}) => {
    const filter = {};

    if (query.status)   filter.status = query.status;
    if (query.provider) filter.provider = query.provider;

    if (query.isCOD !== undefined) {
        filter.isCOD = query.isCOD === "true";
    }

    if (query.search) {
        filter.$or = [
            { "sender.name":        { $regex: query.search, $options: "i" } },
            { "receiver.name":      { $regex: query.search, $options: "i" } },
            { "receiver.phone":     { $regex: query.search, $options: "i" } },
            { providerTrackingNo:   { $regex: query.search, $options: "i" } },
        ];
    }

    return paginate(Shipment, filter, query);
};

const getShipmentById = async (id) => {
    const shipment = await Shipment.findById(id).lean();
    if (!shipment) throw Object.assign(new Error("Shipment not found"), { status: 404 });
    return shipment;
};

const getShipmentWithHistory = async (id) => {
    const shipment = await getShipmentById(id);
    const history = await statusHistory.getHistory(id);
    return { ...shipment, history };
};

const updateStatus = async (id, status, userId, note = "") => {
    const shipment = await Shipment.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!shipment) throw Object.assign(new Error("Shipment not found"), { status: 404 });

    await statusHistory.log(id, status, userId, note);
    return shipment;
};

const cancelShipment = async (id, userId) => {
    const shipment = await Shipment.findById(id);
    if (!shipment) throw Object.assign(new Error("Shipment not found"), { status: 404 });

    if (["delivered", "cancelled"].includes(shipment.status)) {
        throw Object.assign(new Error("Cannot cancel a delivered or already cancelled shipment"), { status: 400 });
    }

    const settings = await Settings.findOne().lean();
    const keys = settings?.providerKeys?.[shipment.provider] || {};
    const adapter = getAdapter(shipment.provider, keys);

    await adapter.cancelShipment(shipment.providerTrackingNo);

    return updateStatus(id, "cancelled", userId, "Cancelled by user");
};

const getCourierAnalytics = async () => {
    const pipeline = [
        {
            $group: {
                _id: "$provider",
                totalBooked: { $sum: 1 },
                totalDelivered: { $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] } },
                totalFailed: { $sum: { $cond: [{ $in: ["$status", ["failed", "cancelled"]] }, 1, 0] } },
                totalInTransit: { $sum: { $cond: [{ $in: ["$status", ["in_transit", "out_for_delivery", "received"]] }, 1, 0] } }
            }
        },
        {
            $project: {
                provider: "$_id",
                _id: 0,
                totalBooked: 1,
                totalDelivered: 1,
                totalFailed: 1,
                totalInTransit: 1,
                deliveryRatio: {
                    $cond: [
                        { $eq: ["$totalBooked", 0] },
                        0,
                        { $multiply: [{ $divide: ["$totalDelivered", "$totalBooked"] }, 100] }
                    ]
                },
                returnRatio: {
                    $cond: [
                        { $eq: ["$totalBooked", 0] },
                        0,
                        { $multiply: [{ $divide: ["$totalFailed", "$totalBooked"] }, 100] }
                    ]
                }
            }
        },
        { $sort: { deliveryRatio: -1 } }
    ];

    return Shipment.aggregate(pipeline);
};

module.exports = {
    createShipment,
    getShipments,
    getShipmentById,
    getShipmentWithHistory,
    updateStatus,
    cancelShipment,
    getCourierAnalytics,
};