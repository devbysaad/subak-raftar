import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import { ROLES } from "../../config/constants.js";
import { get, update, updateShopify, updateProvider } from "./settings.controller.js";

const router = Router();
router.use(authMiddleware);

router.get("/",                       get);
router.patch("/",                     requireRole(ROLES.ADMIN), update);
router.patch("/shopify",              requireRole(ROLES.ADMIN), updateShopify);
router.patch("/providers/:provider",  requireRole(ROLES.ADMIN), updateProvider);

export default router;
