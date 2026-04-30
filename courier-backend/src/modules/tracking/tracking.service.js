import Shipment from "../shipments/shipment.model.js";
import { getAdapter } from "../provider/provider.factory.js";
import { log } from "../status-history/statusHistory.service.js";
import Settings from "../settings/settings.model.js";
import { onStatusChange } from "../notifications/notification.service.js";

const ACTIVE_STATUSES = ["booked", "received", "in_transit", "out_for_delivery"];

export const pollShipment = async (shipment) => {
    try {
        const settings = await Settings.findOne().lean();
        const keys     = settings?.providerKeys?.[shipment.provider] || {};
        const adapter  = getAdapter(shipment.provider, keys);
        const result   = await adapter.getStatus(shipment.providerTrackingNo);

        if (!result?.status) return;

        if (result.status === shipment.status) {
            await Shipment.findByIdAndUpdate(shipment._id, { lastPolledAt: new Date() });
            return;
        }

        await Shipment.findByIdAndUpdate(shipment._id, {
            status: result.status,
            lastPolledAt: new Date(),
        });

        await log(shipment._id, result.status, null, `Auto-updated by tracking cron from ${shipment.provider}`);
        await onStatusChange(shipment, result.status, settings);
    } catch (err) {
        console.error(`[Tracking] Failed to poll shipment ${shipment._id}:`, err.message);
    }
};

export const pollAllActive = async () => {
    console.log("[Tracking] Polling active shipments...");

    const shipments = await Shipment.find({
        status:   { $in: ACTIVE_STATUSES },
        provider: { $ne: "self" },
    }).lean();

    console.log(`[Tracking] Found ${shipments.length} active shipments to poll`);

    const BATCH_SIZE = 10;
    for (let i = 0; i < shipments.length; i += BATCH_SIZE) {
        const batch = shipments.slice(i, i + BATCH_SIZE);
        await Promise.allSettled(batch.map(pollShipment));
    }

    console.log("[Tracking] Poll complete");
};