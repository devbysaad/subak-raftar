import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) return;
    console.log("[DB] Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
        bufferCommands: false,
        maxPoolSize: 1,
    });
    isConnected = true;
    console.log("[DB] MongoDB connected");
};

export default connectDB;
