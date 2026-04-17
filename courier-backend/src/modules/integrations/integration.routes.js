const { Router } = require("express");
const { verifyShopifyWebhook, handleFulfillmentWebhook } = require("./shopify.service");
const Settings = require("../settings/settings.model");
const { success, failure } = require("../../utils/response.utils");

const router = Router();

// Shopify sends raw body — must use express.raw() for this route
// so we can verify the HMAC signature
router.post(
  "/shopify/:companyId/fulfillment",
  async (req, res) => {
    try {
      const { companyId } = req.params;
      const signature = req.headers["x-shopify-hmac-sha256"];

      // find company and get their shopify secret
      const company = await Company.findById(companyId).lean();
      if (!company?.shopifyConnected) {
        return res.status(400).json(failure("Shopify not connected for this company"));
      }

      // verify the webhook is genuinely from Shopify
      const isValid = verifyShopifyWebhook(
        req.rawBody,    // set in app.js
        signature,
        company.shopifyApiSecret
      );

      if (!isValid) {
        return res.status(401).json(failure("Invalid webhook signature"));
      }

      const order = req.body;
      const shipment = await handleFulfillmentWebhook(companyId, order);

      res.status(200).json(success(shipment, "Shipment created from Shopify order"));
    } catch (err) {
      console.error("[Shopify Webhook]", err.message);
      res.status(500).json(failure(err.message));
    }
  }
);

module.exports = router;