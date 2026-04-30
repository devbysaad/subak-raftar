const mongoose = require("mongoose");

// Global cache — survives across Vercel serverless warm invocations
let cached = global._mongooseCache;
if (!cached) {
    cached = global._mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 1,           // keep pool small for serverless
            serverSelectionTimeoutMS: 10000,
        };

        console.log("[DB] Initializing new MongoDB connection...");
        cached.promise = mongoose
            .connect(process.env.MONGO_URI, opts)
            .then((m) => {
                console.log("[DB] MongoDB successfully connected");
                return m;
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
