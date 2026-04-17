// Vercel Serverless Entry Point — wraps Express app
// All routes hit this file, which hydrates the DB then delegates to Express

const app = require("../src/app");
const connectDB = require("../src/config/db");

let dbConnected = false;

module.exports = async (req, res) => {
    if (!dbConnected) {
        try {
            await connectDB();
            dbConnected = true;
        } catch (err) {
            console.error("[Vercel] DB connection failed:", err.message);
            return res.status(500).json({ success: false, message: "Database connection failed" });
        }
    }
    return app(req, res);
};
