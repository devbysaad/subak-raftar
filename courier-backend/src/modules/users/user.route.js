const { Router } = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const { requireRole } = require("../../middleware/role.middleware");
const { ROLES } = require("../../config/constants");
const { getUsers, getUserById, updateUser, deactivateUser } = require("./user.controller");

const router = Router();
router.use(authMiddleware);

router.get("/", requireRole(ROLES.ADMIN), getUsers);
router.get("/:id", requireRole(ROLES.ADMIN), getUserById);
router.patch("/:id", requireRole(ROLES.ADMIN), updateUser);
router.patch("/:id/deactivate", requireRole(ROLES.ADMIN), deactivateUser);

module.exports = router;