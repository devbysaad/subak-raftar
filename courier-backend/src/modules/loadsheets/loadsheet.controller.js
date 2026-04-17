const loadSheetService = require("./loadsheet.service");
const { success, failure } = require("../../utils/response.utils");

const create = async (req, res) => {
    try {
        const { parcelIds } = req.body;
        if (!Array.isArray(parcelIds) || parcelIds.length === 0) {
            return res.status(400).json(failure("parcelIds must be a non-empty array"));
        }
        const sheet = await loadSheetService.createLoadSheet(parcelIds, req.user._id);
        res.status(201).json(success(sheet, "Load sheet created"));
    } catch (err) {
        res.status(err.status || 500).json(failure(err.message));
    }
};

const list = async (req, res) => {
    try {
        const data = await loadSheetService.getLoadSheets(req.query);
        res.json(success(data));
    } catch (err) {
        res.status(500).json(failure(err.message));
    }
};

const detail = async (req, res) => {
    try {
        const sheet = await loadSheetService.getLoadSheetById(req.params.id);
        res.json(success(sheet));
    } catch (err) {
        res.status(err.status || 500).json(failure(err.message));
    }
};

module.exports = { create, list, detail };
