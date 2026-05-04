import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import { createComplaintSchema } from "./complaint.validator.js";
import { create, list } from "./complaint.controller.js";

const router = Router();

router.post("/", authMiddleware, validate(createComplaintSchema), create);
router.get("/",  authMiddleware, list);

export default router;
