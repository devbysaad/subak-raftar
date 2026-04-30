import { Router } from "express";
import { verifyShopifyWebhook, handleFulfillmentWebhook } from "./shopify.service.js";
import Settings from "../settings/settings.model.js";
import { success, failure } from "../../utils/response.utils.js";

const router = Router();

router.post("/shopify/fulfillment", async (req, res) => {
    try {
        const signature = req.headers["x-shopify-hmac-sha256"];
        const settings  = await Settings.findOne().lean();

        if (!settings?.shopifyConnected) {
            return res.status(400).json(failure("Shopify not connected"));
        }

        const isValid = verifyShopifyWebhook(req.rawBody, signature, settings.shopifyApiSecret);

        if (!isValid) {
            return res.status(401).json(failure("Invalid webhook signature"));
        }

        const shipment = await handleFulfillmentWebhook(req.body);
        res.status(200).json(success(shipment, "Shipment created from Shopify order"));
    } catch (err) {
        console.error("[Shopify Webhook]", err.message);
        res.status(500).json(failure(err.message));
    }
});

export default router;