import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import { create, list, detail } from "./loadsheet.controller.js";

const router = Router();
router.use(authMiddleware);

router.post("/",    create);
router.get("/",     list);
router.get("/:id",  detail);

export default router;
