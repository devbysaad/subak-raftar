const mongoose = require("mongoose");
const { ROLES } = require("../../config/constants");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        role: { type: String, enum: Object.values(ROLES), default: ROLES.CUSTOMER },
        companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
        isActive: { type: Boolean, default: true },
        phone: { type: String },
        authId: { type: String, unique: true, sparse: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);