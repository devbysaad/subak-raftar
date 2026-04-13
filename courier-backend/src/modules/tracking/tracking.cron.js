const cron = require("node-cron");
const { pollAllActive } = require("./tracking.service");

const startTrackingCron = () => {
    // runs every 30 minutes
    cron.schedule("*/30 * * * *", async () => {
        console.log("[Cron] Running tracking job:", new Date().toISOString());
        await pollAllActive();
    });

    console.log("[Cron] Tracking job scheduled — runs every 30 minutes");
};

module.exports = { startTrackingCron };