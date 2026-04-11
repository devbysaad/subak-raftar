const Shipment = require("./shipment.model");
const statusHistory = require("../status-history/statusHistory.service");
const { getAdapter } = require("../provider/provider.factory");
const { paginate } = require("../../utils/pagination.util");
const Company = require("../companies/company.model");

const createShipment = async (data, companyId, userId) => {
    const company = await Company.findById(companyId).lean();
    if (!company) throw Object.assign(new Error("Company not found"), { status: 404 });

    const keys = company.providerKeys?.[data.provider] || {};
    const adapter = getAdapter(data.provider, keys);
    const booking = await adapter.bookShipment(data, companyId);

    const shipment = await Shipment.create({
        ...data,
        companyId,
        createdBy: userId,
        providerTrackingNo: booking.trackingNo,
        providerRef: booking.providerRef || null,
        status: "booked",
    });

    await statusHistory.log(shipment._id, "booked", userId, "Shipment created");

    return shipment.toObject();
};

const getShipments = async (companyId, query = {}) => {
    const filter = {};

    if (companyId) filter.companyId = companyId;
    if (query.status) filter.status = query.status;
    if (query.provider) filter.provider = query.provider;

    if (query.isCOD !== undefined) {
        filter.isCOD = query.isCOD === "true";
    }

    if (query.search) {
        filter.$or = [
            { "sender.name": { $regex: query.search, $options: "i" } },
            { "receiver.name": { $regex: query.search, $options: "i" } },
            { "receiver.phone": { $regex: query.search, $options: "i" } },
            { providerTrackingNo: { $regex: query.search, $options: "i" } },
        ];
    }

    return paginate(Shipment, filter, query);
};

const getShipmentById = async (id, companyId) => {
    const filter = companyId ? { _id: id, companyId } : { _id: id };
    const shipment = await Shipment.findOne(filter).lean();
    if (!shipment) throw Object.assign(new Error("Shipment not found"), { status: 404 });
    return shipment;
};

const getShipmentWithHistory = async (id, companyId) => {
    const shipment = await getShipmentById(id, companyId);
    const history = await statusHistory.getByShipment(id);
    return { ...shipment, history };
};

const updateStatus = async (id, status, userId, note = "", companyId = null) => {
    const filter = companyId ? { _id: id, companyId } : { _id: id };
    const shipment = await Shipment.findOneAndUpdate(filter, { status }, { new: true }).lean();

    if (!shipment) throw Object.assign(new Error("Shipment not found"), { status: 404 });

    await statusHistory.log(id, status, userId, note);

    return shipment;
};

const cancelShipment = async (id, companyId, userId) => {
    const shipment = await Shipment.findOne({ _id: id, companyId });
    if (!shipment) throw Object.assign(new Error("Shipment not found"), { status: 404 });

    if (["delivered", "cancelled"].includes(shipment.status)) {
        throw Object.assign(new Error("Cannot cancel a delivered or already cancelled shipment"), { status: 400 });
    }

    const company = await Company.findById(companyId).lean();
    const keys = company?.providerKeys?.[shipment.provider] || {};
    const adapter = getAdapter(shipment.provider, keys);

    await adapter.cancelShipment(shipment.providerTrackingNo, companyId);

    return updateStatus(id, "cancelled", userId, "Cancelled by user", companyId);
};

module.exports = {
    createShipment,
    getShipments,
    getShipmentById,
    getShipmentWithHistory,
    updateStatus,
    cancelShipment,
};