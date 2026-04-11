const shipmentService = require("./shipment.service");
const { success, failure } = require("../../utils/response.utils");
const { ROLES } = require("../../config/constants");

const create = async (req, res) => {
    try {
        const shipment = await shipmentService.createShipment(req.body, req.user.companyId, req.user._id);
        res.status(201).json(success(shipment, "Shipment created"));
    } catch (err) {
        res.status(err.status || 500).json(failure(err.message));
    }
};

const list = async (req, res) => {
    try {
        const companyId = req.user.role === ROLES.ADMIN ? null : req.user.companyId;
        const data = await shipmentService.getShipments(companyId, req.query);
        res.json(success(data));
    } catch (err) {
        res.status(500).json(failure(err.message));
    }
};

const detail = async (req, res) => {
    try {
        const companyId = req.user.role === ROLES.ADMIN ? null : req.user.companyId;
        const shipment = await shipmentService.getShipmentWithHistory(req.params.id, companyId);
        res.json(success(shipment));
    } catch (err) {
        res.status(err.status || 500).json(failure(err.message));
    }
};

const updateStatus = async (req, res) => {
    try {
        const { status, note } = req.body;
        const shipment = await shipmentService.updateStatus(req.params.id, status, req.user._id, note);
        res.json(success(shipment, "Status updated"));
    } catch (err) {
        res.status(err.status || 500).json(failure(err.message));
    }
};

const cancel = async (req, res) => {
    try {
        const shipment = await shipmentService.cancelShipment(req.params.id, req.user.companyId, req.user._id);
        res.json(success(shipment, "Shipment cancelled"));
    } catch (err) {
        res.status(err.status || 500).json(failure(err.message));
    }
};

module.exports = { create, list, detail, updateStatus, cancel };