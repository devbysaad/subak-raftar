const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = require("./app");
const connectDB = require("./config/db");
const { startTrackingCron } = require("./modules/tracking/tracking.cron");

const required = ["MONGO_URI", "BETTER_AUTH_SECRET", "FRONTEND_URL"];
required.forEach((key) => {
    if (!process.env[key]) throw new Error(`Missing env variable: ${key}`);
});

const start = async () => {
    await connectDB();
    // Start cron only in long-running process (not Vercel serverless)
    startTrackingCron();
    app.listen(process.env.PORT || 5000, () => {
        console.log(`[Server] Running on port ${process.env.PORT || 5000}`);
    });
};

start();