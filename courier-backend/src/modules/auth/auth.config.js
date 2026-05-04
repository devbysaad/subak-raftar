import { MongoClient } from "mongodb";

let _auth   = null;
let _client = null;

export const getAuth = async () => {
    if (_auth) return _auth;

    const { betterAuth }     = await import("better-auth");
    const { mongodbAdapter } = await import("better-auth/adapters/mongodb");
    const { bearer }         = await import("better-auth/plugins");

    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI not set");

    // Reuse the cached client if possible (serverless warm-start)
    if (!_client) {
        _client = new MongoClient(mongoUri);
        await _client.connect();
    }

    const isProd = process.env.NODE_ENV === "production";

    _auth = betterAuth({
        secret:   process.env.BETTER_AUTH_SECRET,
        baseURL:  process.env.BETTER_AUTH_URL ?? (isProd
            ? "https://subak-raftar-server.vercel.app"
            : "http://localhost:5000"),
        basePath: "/api/auth",
        trustedOrigins: [
            "https://subak-raftar.vercel.app",
            "https://subak-raftar-server.vercel.app",
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:5000",
            "http://localhost:5173",
        ],
        database: mongodbAdapter(_client.db()),
        emailAndPassword: {
            enabled: true,
            requireEmailVerification: false,
        },
        plugins: [
            bearer(),
        ],
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
                secure:      isProd,
                httpOnly:    true,
                sameSite:    isProd ? "none" : "lax",
                partitioned: isProd,
            },
        },
    });

    return _auth;
};