const { Router } = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const { list } = require("./invoice.controller");

const router = Router();
router.use(authMiddleware);
router.get("/", list);

module.exports = router;
