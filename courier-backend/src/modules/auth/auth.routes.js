const { Router } = require("express");
const { toNodeHandler } = require("better-auth/node");
const { auth } = require("./auth.config");

const router = Router();

router.all("/*", toNodeHandler(auth));

module.exports = router;