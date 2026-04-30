import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import { requireRole } from "../../middleware/role.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import { ROLES } from "../../config/constants.js";
import { createShipmentSchema, updateStatusSchema } from "./shipment.validator.js";
import { getHistory } from "../status-history/statusHistory.service.js";
import { success, failure } from "../../utils/response.utils.js";
import { create, list, detail, updateStatus, cancel, bulkCreate, getAnalytics } from "./shipment.controller.js";

const router = Router();
router.use(authMiddleware);

router.get("/",                    list);
router.get("/analytics/couriers",  getAnalytics);
router.post("/bulk",               bulkCreate);
router.post("/",                   validate(createShipmentSchema), create);
router.get("/:id",                 detail);
router.get("/:id/history", async (req, res) => {
    try {
        const history = await getHistory(req.params.id);
        res.json(success(history));
    } catch (err) {
        res.status(500).json(failure(err.message));
    }
});
router.patch("/:id/status",        requireRole(ROLES.ADMIN), validate(updateStatusSchema), updateStatus);
router.patch("/:id/cancel",        cancel);

export default router;
