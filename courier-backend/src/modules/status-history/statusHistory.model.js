import mongoose from "mongoose";

const statusHistorySchema = new mongoose.Schema(
    {
        shipmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Shipment", required: true },
        status:     { type: String, required: true },
        updatedBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        note:       { type: String, default: "" },
    },
    { timestamps: true }
);

statusHistorySchema.index({ shipmentId: 1, createdAt: -1 });

export default mongoose.model("StatusHistory", statusHistorySchema);