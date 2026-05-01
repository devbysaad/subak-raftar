import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

let cachedClient = global._mongoAuthClient;

const getClient = () => {
    if (!cachedClient) {
        if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not defined");
        cachedClient = global._mongoAuthClient = new MongoClient(process.env.MONGO_URI);
    }
    return cachedClient;
};

const isProd = process.env.NODE_ENV === "production";

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
    basePath: "/api/auth",
    trustedOrigins: [
        ...(process.env.FRONTEND_URL || "http://localhost:3000")
            .split(",")
            .map((o) => o.trim()),
        process.env.BETTER_AUTH_URL || "http://localhost:5000",
        "http://localhost:5173",
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
        cookieCache: { enabled: true, maxAge: 60 * 5 },
    },
    advanced: {
        crossSubDomainCookies: {
            enabled: isProd,
            domain: isProd ? ".vercel.app" : undefined,
        },
        defaultCookieAttributes: {
            secure: isProd,
            httpOnly: true,
            sameSite: isProd ? "none" : "lax",
            partitioned: isProd,
        },
    },
});