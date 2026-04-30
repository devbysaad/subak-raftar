import { success, failure } from "../../utils/response.utils.js";
import { getSettings, updateSettings, updateShopifyKeys, updateProviderKey } from "./settings.service.js";

export const get = async (req, res) => {
    try {
        const settings = await getSettings();
        if (req.user.role !== "admin") {
            delete settings.shopifyApiSecret;
            delete settings.providerKeys;
        }
        res.json(success(settings));
    } catch (err) {
        res.status(500).json(failure(err.message));
    }
};

export const update = async (req, res) => {
    try {
        const settings = await updateSettings(req.body);
        res.json(success(settings, "Settings updated"));
    } catch (err) {
        res.status(500).json(failure(err.message));
    }
};

export const updateShopify = async (req, res) => {
    try {
        const settings = await updateShopifyKeys(req.body);
        res.json(success(settings, "Shopify connected"));
    } catch (err) {
        res.status(500).json(failure(err.message));
    }
};

export const updateProvider = async (req, res) => {
    try {
        const { provider } = req.params;
        const settings = await updateProviderKey(provider, req.body);
        res.json(success(settings, `${provider} keys saved`));
    } catch (err) {
        res.status(500).json(failure(err.message));
    }
};
