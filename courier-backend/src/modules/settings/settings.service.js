import Settings from "./settings.model.js";

const UPDATABLE = ["companyName", "email", "phone", "address"];

export const getSettings = async () => {
    let settings = await Settings.findOne().lean();
    if (!settings) {
        settings = await Settings.create({ companyName: "Subak Raftar" });
        settings = settings.toObject();
    }
    return settings;
};

export const updateSettings = async (data) => {
    const safeData = {};
    UPDATABLE.forEach((f) => { if (data[f] !== undefined) safeData[f] = data[f]; });
    return Settings.findOneAndUpdate({}, safeData, { new: true, upsert: true }).lean();
};

export const updateShopifyKeys = async ({ shopifyStoreName, shopifyApiKey, shopifyApiSecret }) => {
    return Settings.findOneAndUpdate(
        {},
        { shopifyStoreName, shopifyApiKey, shopifyApiSecret, shopifyConnected: true },
        { new: true, upsert: true }
    ).lean();
};

export const updateProviderKey = async (provider, { apiKey, apiPassword }) => {
    return Settings.findOneAndUpdate(
        {},
        { [`providerKeys.${provider}`]: { apiKey, apiPassword } },
        { new: true, upsert: true }
    ).lean();
};
