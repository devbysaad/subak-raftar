import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) return;

    await mongoose.connect(process.env.MONGO_URI, {
        bufferCommands: false,
        maxPoolSize: 1,
    });
    isConnected = true;

};

export default connectDB;
