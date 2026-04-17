const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name:     { type: String, required: true, trim: true },
        email:    { type: String, required: true, unique: true, lowercase: true },
        role:     { type: String, enum: ["admin", "employee"], default: "employee" },
        isActive: { type: Boolean, default: true },
        phone:    { type: String },
        authId:   { type: String, unique: true, sparse: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);