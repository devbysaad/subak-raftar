const Company = require("./company.model");

const UPDATABLE = ["name", "phone", "address", "isActive"];

const createCompany = async (data) => {
  const exists = await Company.findOne({ email: data.email });
  if (exists) throw Object.assign(new Error("Company with this email already exists"), { status: 409 });
  return Company.create(data);
};

const getCompanyById = async (id) => {
  const company = await Company.findById(id).lean();
  if (!company) throw Object.assign(new Error("Company not found"), { status: 404 });
  return company;
};

const getAllCompanies = async () => Company.find().lean();

const updateCompany = async (id, data) => {
  const safeData = {};
  UPDATABLE.forEach((f) => { if (data[f] !== undefined) safeData[f] = data[f]; });

  const updated = await Company.findByIdAndUpdate(id, safeData, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updated) throw Object.assign(new Error("Company not found"), { status: 404 });
  return updated;
};

const updateShopifyKeys = async (id, { shopifyStoreName, shopifyApiKey, shopifyApiSecret }) => {
  const updated = await Company.findByIdAndUpdate(
    id,
    { shopifyStoreName, shopifyApiKey, shopifyApiSecret, shopifyConnected: true },
    { new: true }
  ).lean();
  if (!updated) throw Object.assign(new Error("Company not found"), { status: 404 });
  return updated;
};

const updateProviderKey = async (id, provider, { apiKey, apiPassword }) => {
  const updated = await Company.findByIdAndUpdate(
    id,
    { [`providerKeys.${provider}`]: { apiKey, apiPassword } },
    { new: true }
  ).lean();
  if (!updated) throw Object.assign(new Error("Company not found"), { status: 404 });
  return updated;
};

module.exports = {
  createCompany,
  getCompanyById,
  getAllCompanies,
  updateCompany,
  updateShopifyKeys,
  updateProviderKey,
};