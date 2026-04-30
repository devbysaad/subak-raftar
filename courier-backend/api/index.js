// ⚠️  env.js MUST be the very first import
import "../src/config/env.js";

import app from "../src/app.js";
import connectDB from "../src/config/db.js";

let dbConnected = false;

export default async function handler(req, res) {
    const origin = req.headers.origin || "";

    const allowed = (process.env.FRONTEND_URL || "http://localhost:3000")
        .split(",")
        .map((o) => o.trim());

    const isAllowed =
        allowed.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin === "";

    if (isAllowed && origin) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Vary", "Origin");
    }

    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With, Accept"
    );

    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }

    if (!dbConnected) {
        try {
            await connectDB();
            dbConnected = true;
        } catch (err) {
            console.error("[Vercel] DB connection failed:", err.message);
            return res.status(500).json({
                success: false,
                message: "Database connection failed",
                error:   err.message,
            });
        }
    }

    return app(req, res);
}
