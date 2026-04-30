import { success, failure } from "../../utils/response.utils.js";
import { createComplaint, getComplaints } from "./complaint.service.js";

export const create = async (req, res) => {
    try {
        const complaint = await createComplaint(req.body, req.user._id);
        res.status(201).json(success(complaint, "Complaint submitted"));
    } catch (err) {
        res.status(err.status || 500).json(failure(err.message));
    }
};

export const list = async (req, res) => {
    try {
        const data = await getComplaints(req.query);
        res.json(success(data));
    } catch (err) {
        res.status(500).json(failure(err.message));
    }
};
