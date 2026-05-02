import cron from "node-cron";
import { pollAllActive } from "./tracking.service.js";

export const startTrackingCron = () => {
    cron.schedule("*/30 * * * *", async () => {

        await pollAllActive();
    });

};