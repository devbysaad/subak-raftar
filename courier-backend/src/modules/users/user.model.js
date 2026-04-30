import mongoose from "mongoose";

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

const User = mongoose.model("User", userSchema, "user");
export default User;
