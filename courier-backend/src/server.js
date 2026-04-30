// ⚠️  env.js MUST be the very first import — it runs before all other modules
import "./config/env.js";

import app from "./app.js";
import connectDB from "./config/db.js";
import { startTrackingCron } from "./modules/tracking/tracking.cron.js";

const required = ["MONGO_URI", "BETTER_AUTH_SECRET", "FRONTEND_URL"];
required.forEach((key) => {
    if (!process.env[key]) throw new Error(`Missing env variable: ${key}`);
});

const start = async () => {
    await connectDB();
    startTrackingCron();
    app.listen(process.env.PORT || 5000, () => {
        console.log(`[Server] Running on port ${process.env.PORT || 5000}`);
    });
};

start();