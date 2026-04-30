import StatusHistory from "./statusHistory.model.js";

export const log = async (shipmentId, status, updatedBy = null, note = "") => {
    return StatusHistory.create({ shipmentId, status, updatedBy, note });
};

export const getHistory = async (shipmentId) => {
    return StatusHistory.find({ shipmentId })
        .sort({ createdAt: 1 })
        .populate("updatedBy", "name email")
        .lean();
};