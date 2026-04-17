const settingsService = require("./settings.service");
const { success, failure } = require("../../utils/response.utils");

const get = async (req, res) => {
  try {
    const settings = await settingsService.getSettings();
    // Strip sensitive keys for non-admin users
    if (req.user.role !== "admin") {
      delete settings.shopifyApiSecret;
      delete settings.providerKeys;
    }
    res.json(success(settings));
  } catch (err) {
    res.status(500).json(failure(err.message));
  }
};

const update = async (req, res) => {
  try {
    const settings = await settingsService.updateSettings(req.body);
    res.json(success(settings, "Settings updated"));
  } catch (err) {
    res.status(500).json(failure(err.message));
  }
};

const updateShopify = async (req, res) => {
  try {
    const settings = await settingsService.updateShopifyKeys(req.body);
    res.json(success(settings, "Shopify connected"));
  } catch (err) {
    res.status(500).json(failure(err.message));
  }
};

const updateProvider = async (req, res) => {
  try {
    const { provider } = req.params;
    const settings = await settingsService.updateProviderKey(provider, req.body);
    res.json(success(settings, `${provider} keys saved`));
  } catch (err) {
    res.status(500).json(failure(err.message));
  }
};

module.exports = { get, update, updateShopify, updateProvider };
