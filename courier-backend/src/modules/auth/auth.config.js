import { MongoClient } from "mongodb";

let _auth = null;

export const getAuth = async () => {
    if (_auth) return _auth;

    const { betterAuth }     = await import("better-auth");
    const { mongodbAdapter } = await import("better-auth/adapters/mongodb");

    const client = new MongoClient(process.env.MONGO_URI);

    _auth = betterAuth({
        secret:   process.env.BETTER_AUTH_SECRET,
        baseURL:  process.env.BETTER_AUTH_URL ?? "https://subak-raftar-server.vercel.app",
        basePath: "/api/auth",
        trustedOrigins: [
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
            cookieCache: { enabled: true, maxAge: 300 },
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