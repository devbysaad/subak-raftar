import crypto from "crypto";
import Shipment from "../shipments/shipment.model.js";
import Settings from "../settings/settings.model.js";
import { getAdapter } from "../provider/provider.factory.js";
import { log } from "../status-history/statusHistory.service.js";

export const verifyShopifyWebhook = (rawBody, signature, secret) => {
    if (!secret || !signature) return false;
    const hash = crypto
        .createHmac("sha256", secret)
        .update(rawBody, "utf8")
        .digest("base64");
    return hash === signature;
};

const mapOrderToShipment = (order) => ({
    receiver: {
        name:    `${order.shipping_address?.first_name || ""} ${order.shipping_address?.last_name || ""}`.trim() || "Customer",
        phone:   order.shipping_address?.phone || "0300000000",
        address: order.shipping_address?.address1 || "",
        city:    order.shipping_address?.city || "",
    },
    weight:         order.total_weight ? order.total_weight / 1000 : 1,
    isCOD:          false,
    codAmount:      0,
    shopifyOrderId: String(order.id),
    notes:          `Auto-created from Shopify order #${order.order_number}`,
});

export const handleFulfillmentWebhook = async (order) => {
    const exists = await Shipment.findOne({ shopifyOrderId: String(order.id) });
    if (exists) {

        return exists;
    }

    const settings = await Settings.findOne().lean();
    if (!settings) throw new Error("System settings not configured");

    const provider = Object.keys(settings.providerKeys || {}).find(
        (p) => settings.providerKeys[p]?.apiKey
    ) || "self";

    const keys    = settings.providerKeys?.[provider] || {};
    const adapter = getAdapter(provider, keys);
    const data    = mapOrderToShipment(order);
    const booking = await adapter.bookShipment(data);

    const shipment = await Shipment.create({
        ...data,
        createdBy:          null,
        provider,
        providerTrackingNo: booking.trackingNo,
        status:             "booked",
    });

    await log(shipment._id, "booked", null, `Auto-created from Shopify order #${order.order_number}`);

    return shipment;
};