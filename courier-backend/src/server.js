import "./config/env.js";

import { connectDB } from "./config/db.js";
import { getAuth }   from "./modules/auth/auth.config.js";

let app = null;

const getApp = async () => {
    if (app) return app;
    await connectDB();
    await getAuth();
    const { default: expressApp } = await import("./app.js");
    app = expressApp;
    return app;
};

if (process.env.NODE_ENV !== "production") {
    const PORT     = process.env.PORT || 5000;
    const localApp = await getApp();
    const server   = localApp.listen(PORT, () => {
        console.log(`🚀  Server running on http://localhost:${PORT}`);
    });
    server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.error(`❌  Port ${PORT} is already in use. Kill the process first:\n    npx kill-port ${PORT}`);
        } else {
            console.error("❌  Server error:", err.message);
        }
        process.exit(1);
    });
}

export default async (req, res) => {
    const resolvedApp = await getApp();
    return resolvedApp(req, res);
};