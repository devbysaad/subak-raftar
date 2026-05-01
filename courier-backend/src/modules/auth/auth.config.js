import { MongoClient } from "mongodb";

let _auth = null;

export const getAuth = async () => {
    if (_auth) return _auth;

    const { betterAuth }     = await import("better-auth");
    const { mongodbAdapter } = await import("better-auth/adapters/mongodb");

    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI not set");

    const client = new MongoClient(mongoUri);

    const backendUrl   = process.env.BETTER_AUTH_URL || "https://subak-raftar-server.vercel.app";
    const frontendUrls = (process.env.FRONTEND_URL   || "https://subak-raftar.vercel.app")
        .split(",")
        .map((u) => u.trim());

    _auth = betterAuth({
        secret:   process.env.BETTER_AUTH_SECRET,
        baseURL:  backendUrl,
        basePath: "/api/auth",
        trustedOrigins: [
            ...frontendUrls,
            "https://subak-raftar.vercel.app",
            "https://subak-raftar-server.vercel.app",
            "http://localhost:3000",
            "http://localhost:5000",
            "http://localhost:5173",
        ],
        database: mongodbAdapter(client.db()),
        emailAndPassword: {
            enabled: true,
            requireEmailVerification: false,
        },
        session: {
            expiresIn:   60 * 60 * 24 * 7,
            updateAge:   60 * 60 * 24,
            cookieCache: { enabled: true, maxAge: 60 * 5 },
        },
        advanced: {
            crossSubDomainCookies: {
                enabled: true,
                domain:  ".vercel.app",
            },
            defaultCookieAttributes: {
                secure:      true,
                httpOnly:    true,
                sameSite:    "none",
                partitioned: true,
            },
        },
    });

    return _auth;
};