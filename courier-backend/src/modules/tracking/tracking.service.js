const Shipment = require("../shipments/shipment.model");
const { getAdapter } = require("../provider/provider.factory");
const statusHistoryService = require("../status-history/statusHistory.service");
const Company = require("../companies/company.model");
const notificationService = require("../notifications/notification.service");

// statuses that still need polling — no point polling delivered/cancelled
const ACTIVE_STATUSES = ["booked", "received", "in_transit", "out_for_delivery"];

const pollShipment = async (shipment) => {
    try {
        const company = await Company.findById(shipment.companyId).lean();
        if (!company) return;

        const keys = company.providerKeys?.[shipment.provider] || {};
        const adapter = getAdapter(shipment.provider, keys);

        const result = await adapter.getStatus(shipment.providerTrackingNo, shipment.companyId);
        if (!result?.status) return;

        // only update if status actually changed
        if (result.status === shipment.status) {
            await Shipment.findByIdAndUpdate(shipment._id, { lastPolledAt: new Date() });
            return;
        }

        await Shipment.findByIdAndUpdate(shipment._id, {
            status: result.status,
            lastPolledAt: new Date(),
        });

        await statusHistoryService.log(
            shipment._id,
            result.status,
            null,
            `Auto-updated by tracking cron from ${shipment.provider}`
        );

        // trigger notifications on status change
        await notificationService.onStatusChange(shipment, result.status, company);

    } catch (err) {
        console.error(`[Tracking] Failed to poll shipment ${shipment._id}:`, err.message);
    }
};

const pollAllActive = async () => {
    console.log("[Tracking] Polling active shipments...");

    const shipments = await Shipment.find({
        status: { $in: ACTIVE_STATUSES },
        provider: { $ne: "self" }, // skip manual/local deliveries
    }).lean();

    console.log(`[Tracking] Found ${shipments.length} active shipments to poll`);

    // poll in batches of 10 to avoid hammering courier APIs
    const BATCH_SIZE = 10;
    for (let i = 0; i < shipments.length; i += BATCH_SIZE) {
        const batch = shipments.slice(i, i + BATCH_SIZE);
        await Promise.allSettled(batch.map(pollShipment));
    }

    console.log("[Tracking] Poll complete");
};

module.exports = { pollAllActive, pollShipment };