const { Router } = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const { requireRole } = require("../../middleware/role.middleware");
const { ROLES } = require("../../config/constants");
const { get, update, updateShopify, updateProvider } = require("./settings.controller");

const router = Router();
router.use(authMiddleware);

// Any authenticated user can read settings (secrets are stripped for non-admins)
router.get("/", get);

// Admin only — write operations
router.patch("/",                        requireRole(ROLES.ADMIN), update);
router.patch("/shopify",                 requireRole(ROLES.ADMIN), updateShopify);
router.patch("/providers/:provider",     requireRole(ROLES.ADMIN), updateProvider);

module.exports = router;
