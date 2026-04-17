const mongoose = require("mongoose");

/**
 * Singleton document — there is exactly ONE document in this collection.
 * It stores global system configuration: company info + integration credentials.
 */
const settingsSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: "Subak Raftar" },
    email:       { type: String },
    phone:       { type: String },
    address:     { type: String },

    // Shopify integration
    shopifyStoreName:  { type: String },
    shopifyApiKey:     { type: String },
    shopifyApiSecret:  { type: String },
    shopifyConnected:  { type: Boolean, default: false },

    // Courier provider API keys
    providerKeys: {
      tcs:    { apiKey: String, apiPassword: String },
      trax:   { apiKey: String, apiPassword: String },
      mp:     { apiKey: String, apiPassword: String },
      tranzo: { apiKey: String, apiPassword: String },
      leopards: { apiKey: String, apiPassword: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
