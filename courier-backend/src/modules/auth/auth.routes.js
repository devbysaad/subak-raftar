import { Router } from "express";
import { toNodeHandler } from "better-auth/node";
import { getAuth } from "./auth.config.js";

const router = Router();

// better-auth calls res.end() directly, bypassing Express response pipeline.
// We must set CORS headers here before handing off — the global CORS middleware
// in app.js runs but better-auth overwrites the response before those headers
// can reach the client.
router.all("/*", async (req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
        res.header("Access-Control-Allow-Origin",      origin);
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Methods",     "GET,POST,PUT,PATCH,DELETE,OPTIONS");
        res.header("Access-Control-Allow-Headers",     "Content-Type,Authorization,Cookie");
    }
    if (req.method === "OPTIONS") return res.sendStatus(204);

    try {
        const auth    = await getAuth();
        const handler = toNodeHandler(auth);
        return handler(req, res);
    } catch (err) {
        next(err);
    }
});

export default router;
