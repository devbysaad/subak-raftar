import { Router } from "express";
import { toNodeHandler } from "better-auth/node";
import { getAuth } from "./auth.config.js";

const router = Router();

router.all("/*", async (req, res, next) => {
    try {
        const auth    = await getAuth();
        const handler = toNodeHandler(auth);
        return handler(req, res);
    } catch (err) {
        next(err);
    }
});

export default router;
