import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import { list } from "./invoice.controller.js";

const router = Router();
router.use(authMiddleware);

router.get("/", list);

export default router;
