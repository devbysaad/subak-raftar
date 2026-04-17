const mongoose = require("mongoose");

const loadSheetSchema = new mongoose.Schema(
    {
        loadSheetNo: { type: String, required: true, unique: true },
        parcelIds:   [{ type: mongoose.Schema.Types.ObjectId, ref: "Shipment" }],
        createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("LoadSheet", loadSheetSchema);
