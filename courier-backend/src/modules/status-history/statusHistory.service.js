const StatusHistory = require("./statusHistory.model");

const log = async (shipmentId, status, updatedBy = null, note = "") => {
  return StatusHistory.create({ shipmentId, status, updatedBy, note });
};

const getByShipment = async (shipmentId) => {
  return StatusHistory.find({ shipmentId })
    .sort({ createdAt: 1 })
    .populate("updatedBy", "name email")
    .lean();
};

module.exports = { log, getByShipment };