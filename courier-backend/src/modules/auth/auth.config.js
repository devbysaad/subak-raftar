const { betterAuth } = require("better-auth");
const { mongodbAdapter } = require("better-auth/adapters/mongodb");
const { MongoClient } = require("mongodb");

let _client = null;

const getClient = () => {
    if (!_client) {
        if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not defined");
        _client = new MongoClient(process.env.MONGO_URI);
    }
    return _client;
};

exports.auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: "http://localhost:5000",
    trustedOrigins: (process.env.FRONTEND_URL || "http://localhost:3000").split(",").map(o => o.trim()),
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