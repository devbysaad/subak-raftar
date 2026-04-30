import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
    {
        companyName: { type: String, default: "Subak Raftar" },
        email:       { type: String },
        phone:       { type: String },
        address:     { type: String },

        shopifyStoreName:  { type: String },
        shopifyApiKey:     { type: String },
        shopifyApiSecret:  { type: String },
        shopifyConnected:  { type: Boolean, default: false },

        providerKeys: {
            tcs:      { apiKey: String, apiPassword: String },
            trax:     { apiKey: String, apiPassword: String },
            mp:       { apiKey: String, apiPassword: String },
            tranzo:   { apiKey: String, apiPassword: String },
            leopards: { apiKey: String, apiPassword: String },
        },
    },
    { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
