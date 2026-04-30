const { Router } = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const { requireRole } = require("../../middleware/role.middleware");
const { ROLES } = require("../../config/constants");
const {
    getMe,
    getUsers,
    createUser,
    getUserById,
    updateUser,
    deactivateUser,
} = require("./user.controller");

const router = Router();
router.use(authMiddleware);

// ⚠️  /me MUST be defined BEFORE /:id — otherwise Express treats "me" as an id param
router.get("/me", getMe);

// Admin-only user management
router.get("/",                        requireRole(ROLES.ADMIN), getUsers);
router.post("/",                       requireRole(ROLES.ADMIN), createUser);
router.get("/:id",                     requireRole(ROLES.ADMIN), getUserById);
router.patch("/:id",                   requireRole(ROLES.ADMIN), updateUser);
router.patch("/:id/deactivate",        requireRole(ROLES.ADMIN), deactivateUser);

module.exports = router;
