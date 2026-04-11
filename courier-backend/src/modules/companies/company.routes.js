const { Router } = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const { requireRole } = require("../../middleware/role.middleware");
const { ROLES } = require("../../config/constants");
const ctrl = require("./company.controller");

const router = Router();
router.use(authMiddleware);

router.get("/me", ctrl.getMyCompany);
router.patch("/me/shopify", ctrl.updateShopifyKeys);
router.patch("/me/providers/:provider", ctrl.updateProviderKey);

router.post("/", requireRole(ROLES.ADMIN), ctrl.createCompany);
router.get("/", requireRole(ROLES.ADMIN), ctrl.getAllCompanies);
router.patch("/:id", requireRole(ROLES.ADMIN), ctrl.updateCompany);

module.exports = router;