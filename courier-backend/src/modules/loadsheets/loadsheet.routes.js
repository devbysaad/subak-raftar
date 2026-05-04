import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import { createLoadSheetSchema } from "./loadsheet.validator.js";
import { create, list, detail } from "./loadsheet.controller.js";

const router = Router();

router.post("/",    authMiddleware, validate(createLoadSheetSchema), create);
router.get("/",     authMiddleware, list);
router.get("/:id",  authMiddleware, detail);

export default router;
