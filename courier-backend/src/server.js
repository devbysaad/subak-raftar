import "./config/env.js";

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Local dev
if (process.env.NODE_ENV !== "production") {
    await connectDB();
    app.listen(PORT, () => console.log(`[Server] Running on port ${PORT}`));
}

// Vercel serverless export
export default async (req, res) => {
    await connectDB();
    return app(req, res);
};