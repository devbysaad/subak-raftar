const mongoose = require("mongoose");

const connectDB = async () => {
    // Already connected — skip (important for Vercel warm instances)
    if (mongoose.connection.readyState >= 1) return;

    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
    });
    console.log("[DB] MongoDB connected");
};

module.exports = connectDB;