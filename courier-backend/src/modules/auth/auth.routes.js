import { Router } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.config.js";

const router = Router();

const handler = toNodeHandler(auth);

router.all("/*", (req, res) => handler(req, res));

export default router;
