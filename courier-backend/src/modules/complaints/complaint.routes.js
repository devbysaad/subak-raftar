import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import { create, list } from "./complaint.controller.js";

const router = Router();
router.use(authMiddleware);

router.post("/", create);
router.get("/",  list);

export default router;
