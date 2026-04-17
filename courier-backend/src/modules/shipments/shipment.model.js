const mongoose = require("mongoose");
const { SHIPMENT_STATUS, PROVIDERS, COD_STATUS } = require("../../config/constants");

const addressSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true },
    phone:   { type: String, required: true },
    address: { type: String, required: true },
    city:    { type: String, required: true },
  },
  { _id: false }
);

const shipmentSchema = new mongoose.Schema(
  {
    createdBy:          { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sender:             { type: addressSchema, required: true },
    receiver:           { type: addressSchema, required: true },
    weight:             { type: Number, required: true },
    packageType:        { type: String, enum: ["parcel", "envelope", "pallet"], default: "parcel" },
    description:        { type: String },
    provider:           { type: String, enum: Object.values(PROVIDERS), required: true },
    providerTrackingNo: { type: String },
    providerRef:        { type: String },
    status:             { type: String, enum: Object.values(SHIPMENT_STATUS), default: SHIPMENT_STATUS.BOOKED },
    isCOD:              { type: Boolean, default: false },
    codAmount:          { type: Number, default: 0 },
    codStatus:          { type: String, enum: Object.values(COD_STATUS), default: COD_STATUS.PENDING },
    shopifyOrderId:     { type: String },
    notes:              { type: String },
    lastPolledAt:       { type: Date },
  },
  { timestamps: true }
);

shipmentSchema.index({ createdAt: -1 });
shipmentSchema.index({ providerTrackingNo: 1 });

module.exports = mongoose.model("Shipment", shipmentSchema);