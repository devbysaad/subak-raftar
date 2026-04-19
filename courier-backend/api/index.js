// Vercel Serverless Entry Point — wraps Express app
// All routes hit this file, which hydrates the DB then delegates to Express

let app;
let connectDB;
try {
    app = require("../src/app");
    connectDB = require("../src/config/db");
} catch (err) {
    console.error("[Vercel] Server Boot Error:", err);
    // If the server fails to boot (e.g. missing env vars, bad imports), return the exact error in JSON
    module.exports = (req, res) => {
        res.status(500).json({ 
            success: false, 
            message: "Server Boot Error (FUNCTION_INVOCATION_FAILED intercepted)", 
            error: err.message, 
            stack: err.stack 
        });
    };
    // Return early so Vercel doesn't crash the lambda
    return;
}

let dbConnected = false;

module.exports = async (req, res) => {
    // Add CORS headers explicitly to the Vercel entry point so error responses don't cause CORS errors in the browser
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (!dbConnected) {
        try {
            await connectDB();
            dbConnected = true;
        } catch (err) {
            console.error("[Vercel] DB connection failed:", err.message);
            return res.status(500).json({ success: false, message: "Database connection failed", error: err.message });
        }
    }
    return app(req, res);
};
