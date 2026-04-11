const mongoose = require("mongoose");
const { SHIPMENT_STATUS } = require("../../config/constants");

const statusHistorySchema = new mongoose.Schema(
  {
    shipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipment",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(SHIPMENT_STATUS),
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

statusHistorySchema.index({ shipmentId: 1, createdAt: -1 });

module.exports = mongoose.model("StatusHistory", statusHistorySchema);