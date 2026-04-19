const { betterAuth } = require("better-auth");
const { mongodbAdapter } = require("better-auth/adapters/mongodb");
const { MongoClient } = require("mongodb");

let cachedClient = global._mongoClient;

const getClient = () => {
    if (!cachedClient) {
        if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not defined");
        cachedClient = global._mongoClient = new MongoClient(process.env.MONGO_URI);
    }
    return cachedClient;
};

exports.auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL || process.env.BACKEND_URL || "http://localhost:5000",
    basePath: "/api/auth",
    trustedOrigins: [
        ...(process.env.FRONTEND_URL || "http://localhost:3000").split(",").map(o => o.trim()),
        "https://subak-raftar.vercel.app" // explicitly trust frontend vercel URL
    ],
    get database() {
        return mongodbAdapter(getClient().db());
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5,
        },
    },
});