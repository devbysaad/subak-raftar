const { betterAuth } = require("better-auth");
const { mongodbAdapter } = require("better-auth/adapters/mongodb");
const { MongoClient } = require("mongodb");

// Lazily cached MongoDB native client for better-auth adapter
let cachedClient = global._mongoAuthClient;

const getClient = () => {
    if (!cachedClient) {
        if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not defined");
        cachedClient = global._mongoAuthClient = new MongoClient(process.env.MONGO_URI);
    }
    return cachedClient;
};

const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL:
        process.env.BETTER_AUTH_URL ||
        process.env.BACKEND_URL ||
        "http://localhost:5000",
    basePath: "/api/auth",
    trustedOrigins: [
        ...(process.env.FRONTEND_URL || "http://localhost:3000")
            .split(",")
            .map((o) => o.trim()),
        `http://localhost:${process.env.PORT || 5000}`,
    ],
    get database() {
        return mongodbAdapter(getClient().db());
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge:  60 * 60 * 24,     // rotate session every 24 h
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5, // 5 minutes
        },
    },
    // ⚠️  No hooks here — user creation is handled exclusively in auth.middleware.js
    //     to avoid double-creation race conditions.
});

module.exports = { auth };
