import "./config/env.js";

import { connectDB } from "./config/db.js";
import { getAuth }   from "./modules/auth/auth.config.js";

let app = null;

const getApp = async () => {
    if (app) return app;
    await connectDB();
    await getAuth(); // pre-warm auth singleton before first request
    const { default: expressApp } = await import("./app.js");
    app = expressApp;
    return app;
};

// Local dev — not production
if (process.env.NODE_ENV !== "production") {
    const PORT     = process.env.PORT || 5000;
    const localApp = await getApp();
    localApp.listen(PORT, () => console.log(`[Server] Running on port ${PORT}`));
}

// Vercel serverless export
export default async (req, res) => {
    const resolvedApp = await getApp();
    return resolvedApp(req, res);
};