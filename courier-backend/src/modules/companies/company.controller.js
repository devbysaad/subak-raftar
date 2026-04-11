const companyService = require("./company.service");
const { success, failure } = require("../../utils/response.utils");

const createCompany = async (req, res) => {
  try {
    const company = await companyService.createCompany(req.body);
    res.status(201).json(success(company, "Company created"));
  } catch (err) {
    res.status(err.status || 500).json(failure(err.message));
  }
};

const getAllCompanies = async (req, res) => {
  try {
    const companies = await companyService.getAllCompanies();
    res.json(success(companies));
  } catch (err) {
    res.status(500).json(failure(err.message));
  }
};

const getMyCompany = async (req, res) => {
  try {
    const company = await companyService.getCompanyById(req.user.companyId);
    res.json(success(company));
  } catch (err) {
    res.status(err.status || 500).json(failure(err.message));
  }
};

const updateCompany = async (req, res) => {
  try {
    const company = await companyService.updateCompany(req.params.id, req.body);
    res.json(success(company));
  } catch (err) {
    res.status(err.status || 500).json(failure(err.message));
  }
};

const updateShopifyKeys = async (req, res) => {
  try {
    const company = await companyService.updateShopifyKeys(req.user.companyId, req.body);
    res.json(success(company, "Shopify connected"));
  } catch (err) {
    res.status(err.status || 500).json(failure(err.message));
  }
};

const updateProviderKey = async (req, res) => {
  try {
    const { provider } = req.params;
    const company = await companyService.updateProviderKey(
      req.user.companyId,
      provider,
      req.body
    );
    res.json(success(company, `${provider} keys saved`));
  } catch (err) {
    res.status(err.status || 500).json(failure(err.message));
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  getMyCompany,
  updateCompany,
  updateShopifyKeys,
  updateProviderKey,
};