const complaintService = require("./complaint.service");
const { success, failure } = require("../../utils/response.utils");

const create = async (req, res) => {
    try {
        const complaint = await complaintService.createComplaint(req.body, req.user._id);
        res.status(201).json(success(complaint, "Complaint submitted"));
    } catch (err) {
        res.status(err.status || 500).json(failure(err.message));
    }
};

const list = async (req, res) => {
    try {
        const data = await complaintService.getComplaints(req.query);
        res.json(success(data));
    } catch (err) {
        res.status(500).json(failure(err.message));
    }
};

module.exports = { create, list };
