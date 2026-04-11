const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    phone:    { type: String },
    address:  { type: String },
    isActive: { type: Boolean, default: true },

    // shopify integration
    shopifyStoreName:  { type: String },
    shopifyApiKey:     { type: String },
    shopifyApiSecret:  { type: String },
    shopifyConnected:  { type: Boolean, default: false },

    // provider API keys stored per provider
    providerKeys: {
      tcs:    { apiKey: String, apiPassword: String },
      trax:   { apiKey: String, apiPassword: String },
      mp:     { apiKey: String, apiPassword: String },
      tranzo: { apiKey: String, apiPassword: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);