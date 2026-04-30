import { success, failure } from "../../utils/response.utils.js";
import * as shipmentService from "./shipment.service.js";
import { getHistory } from "../status-history/statusHistory.service.js";

export const create = async (req, res) => {
    try {
        const shipment = await shipmentService.createShipment(req.body, req.user._id);
        res.status(201).json(success(shipment, "Shipment created"));
    } catch (err) {
        res.status(err.status || 500).json(failure(err.message));
    }
};

export const list = async (req, res) => {
    try {
        const data = await shipmentService.getShipments(req.query);
        res.json(success(data));
    } catch (err) {
        res.status(500).json(failure(err.message));
    }
};

export const getAnalytics = async (req, res) => {
    try {
        const data = await shipmentService.getCourierAnalytics();
        res.json(success(data));
    } catch (err) {
        res.status(500).json(failure(err.message));
    }
};

export const detail = async (req, res) => {
    try {
        const shipment = await shipmentService.getShipmentWithHistory(req.params.id);
        res.json(success(shipment));
    } catch (err) {
        res.status(err.status || 500).json(failure(err.message));
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { status, note } = req.body;
        const shipment = await shipmentService.updateStatus(req.params.id, status, req.user._id, note);
        res.json(success(shipment, "Status updated"));
    } catch (err) {
        res.status(err.status || 500).json(failure(err.message));
    }
};

export const cancel = async (req, res) => {
    try {
        const shipment = await shipmentService.cancelShipment(req.params.id, req.user._id);
        res.json(success(shipment, "Shipment cancelled"));
    } catch (err) {
        res.status(err.status || 500).json(failure(err.message));
    }
};

export const bulkCreate = async (req, res) => {
    try {
        const items = Array.isArray(req.body) ? req.body : req.body.shipments;
        if (!items || items.length === 0) {
            return res.status(400).json(failure("No shipment data provided"));
        }

        const created = [];
        const errors  = [];

        for (let i = 0; i < items.length; i++) {
            try {
                const shipment = await shipmentService.createShipment(items[i], req.user._id);
                created.push(shipment);
            } catch (err) {
                errors.push({ row: i + 1, error: err.message, data: items[i] });
            }
        }

        res.status(207).json(
            success(
                { created: created.length, failed: errors.length, errors },
                `${created.length} shipments created, ${errors.length} failed`
            )
        );
    } catch (err) {
        res.status(500).json(failure(err.message));
    }
};
