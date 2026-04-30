const { Router } = require("express");
const { toNodeHandler } = require("better-auth/node");
const { auth } = require("./auth.config");

const router = Router();

// better-auth handles all auth routes under /api/auth/*
// toNodeHandler adapts the fetch-based better-auth handler to Node/Express
const handler = toNodeHandler(auth);

router.all("/*", (req, res) => handler(req, res));

module.exports = router;
