import { MongoClient } from "mongodb";

let _auth = null;

export const getAuth = async () => {
    if (_auth) return _auth;

    const { betterAuth }     = await import("better-auth");
    const { mongodbAdapter } = await import("better-auth/adapters/mongodb");

    const client = new MongoClient(process.env.MONGO_URI);
    const isProd = process.env.NODE_ENV === "production";

    _auth = betterAuth({
        secret:   process.env.BETTER_AUTH_SECRET,
        baseURL:  process.env.BETTER_AUTH_URL ?? "http://localhost:5000",
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
                enabled: isProd,
                domain:  isProd ? ".vercel.app" : undefined,
            },
            defaultCookieAttributes: {
                secure:      isProd,              // false on localhost (HTTP), true on Vercel (HTTPS)
                httpOnly:    true,
                sameSite:    isProd ? "none" : "lax",  // "none" needs HTTPS — breaks localhost
                partitioned: isProd,              // partitioned also requires secure
            },
        },
    });

    return _auth;
};