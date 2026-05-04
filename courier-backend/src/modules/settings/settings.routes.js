import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import { ROLES } from "../../config/constants.js";
import {
    updateSettingsSchema,
    updateProviderKeySchema,
    updateShopifySchema,
} from "./settings.validator.js";
import { get, update, updateShopify, updateProvider } from "./settings.controller.js";

const router = Router();
router.use(authMiddleware);

router.get("/",                       get);
router.patch("/",                     requireRole(ROLES.ADMIN), validate(updateSettingsSchema), update);
router.patch("/shopify",              requireRole(ROLES.ADMIN), validate(updateShopifySchema), updateShopify);
router.patch("/providers/:provider",  requireRole(ROLES.ADMIN), validate(updateProviderKeySchema), updateProvider);

export default router;
