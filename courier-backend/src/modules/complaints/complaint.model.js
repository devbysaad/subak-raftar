import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
    {
        parcelNo:   { type: String, required: true, trim: true },
        shipmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Shipment" },
        status:     { type: String, default: "open" },
        remarks:    { type: String },
        rStatus:    { type: String },
        cStatus:    { type: String },
        createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);
