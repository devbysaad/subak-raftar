const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
    {
        parcelNo:   { type: String, required: true, trim: true },
        shipmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Shipment" },
        status:     { type: String, default: "open" },
        remarks:    { type: String },
        rStatus:    { type: String },   // resolution status
        cStatus:    { type: String },   // complaint status
        createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
