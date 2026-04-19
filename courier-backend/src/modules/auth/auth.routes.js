const { Router } = require("express");
const { auth } = require("./auth.config");

const router = Router();

// Use dynamic import because better-auth/node is ESM only (.mjs)
// and Vercel Node runtime throws ERR_REQUIRE_ESM on require()
router.all("/*", async (req, res, next) => {
    try {
        const { toNodeHandler } = await import("better-auth/node");
        const handler = toNodeHandler(auth);
        return handler(req, res);
    } catch (err) {
        next(err);
    }
});

module.exports = router;