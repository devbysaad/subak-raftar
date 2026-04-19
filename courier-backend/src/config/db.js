const mongoose = require("mongoose");

// Global cache to prevent multiple connections in Vercel Serverless environment
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 10000,
        };

        console.log("[DB] Initializing new MongoDB connection...");
        cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
            console.log("[DB] MongoDB successfully connected");
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error("[DB] MongoDB connection error:", e);
        throw e;
    }

    return cached.conn;
};

module.exports = connectDB;