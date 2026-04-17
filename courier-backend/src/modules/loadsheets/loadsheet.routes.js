const { Router } = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const { create, list, detail } = require("./loadsheet.controller");

const router = Router();
router.use(authMiddleware);

router.post("/", create);
router.get("/",   list);
router.get("/:id", detail);

module.exports = router;
