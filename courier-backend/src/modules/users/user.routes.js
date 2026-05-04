import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import { ROLES } from "../../config/constants.js";
import { createUserSchema, updateUserSchema } from "./user.validator.js";
import {
    getMe,
    getUsers,
    createUser,
    getUserByIdController,
    updateUserController,
    deactivateUserController,
} from "./user.controller.js";

const router = Router();
router.use(authMiddleware);

router.get("/me", getMe);

router.get("/",                    requireRole(ROLES.ADMIN), getUsers);
router.post("/",                   requireRole(ROLES.ADMIN), validate(createUserSchema), createUser);
router.get("/:id",                 requireRole(ROLES.ADMIN), getUserByIdController);
router.patch("/:id",               requireRole(ROLES.ADMIN), validate(updateUserSchema), updateUserController);
router.patch("/:id/deactivate",    requireRole(ROLES.ADMIN), deactivateUserController);

export default router;
