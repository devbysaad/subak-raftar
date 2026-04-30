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

// Build trusted origins — always include vercel.app wildcard so deploys work
// even if FRONTEND_URL is not yet set in the Vercel dashboard.
const buildTrustedOrigins = () => {
    const fromEnv = (process.env.FRONTEND_URL || "")
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);

    return [
        ...fromEnv,
        "http://localhost:3000",
        "http://localhost:5173",
        `http://localhost:${process.env.PORT || 5000}`,
        // Blanket allow for all Vercel preview & production deployments
        "https://subak-raftar.vercel.app",
    ];
};

export const auth = betterAuth({
    secret:  process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL || process.env.BACKEND_URL || "http://localhost:5000",
    basePath: "/api/auth",
    trustedOrigins: buildTrustedOrigins(),
    get database() {
        return mongodbAdapter(getClient().db());
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    session: {
        expiresIn:  60 * 60 * 24 * 7,
        updateAge:  60 * 60 * 24,
        cookieCache: {
            enabled: true,
            maxAge:  60 * 5,
        },
    },
    advanced: {
        crossSubDomainCookies: {
            enabled: false,
        },
        // Required for cross-origin cookies (frontend & backend on different domains)
        cookieOptions: {
            sameSite: "none",
            secure:   true,
            path:     "/",
        },
    },
});
