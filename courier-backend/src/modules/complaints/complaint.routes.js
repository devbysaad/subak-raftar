const { Router } = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const { create, list } = require("./complaint.controller");

const router = Router();
router.use(authMiddleware);

router.post("/", create);
router.get("/",  list);

module.exports = router;
