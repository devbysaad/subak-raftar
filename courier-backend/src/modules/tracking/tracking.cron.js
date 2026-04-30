import cron from "node-cron";
import { pollAllActive } from "./tracking.service.js";

export const startTrackingCron = () => {
    cron.schedule("*/30 * * * *", async () => {
        console.log("[Cron] Running tracking job:", new Date().toISOString());
        await pollAllActive();
    });
    console.log("[Cron] Tracking job scheduled — runs every 30 minutes");
};