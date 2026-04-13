const { Router } = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const { requireRole } = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");
const statusHistoryService = require("../status-history/statusHistory.service");
const { success, failure } = require("../../utils/response.util");
const { ROLES } = require("../../config/constants");
const { createShipmentSchema, updateStatusSchema } = require("./shipment.validator");
const ctrl = require("./shipment.controller");

const router = Router();
router.use(authMiddleware);

router.get("/", ctrl.list);
router.get("/:id", ctrl.detail);
router.post("/", validate(createShipmentSchema), ctrl.create);
router.patch("/:id/status", requireRole(ROLES.ADMIN), validate(updateStatusSchema), ctrl.updateStatus);
router.patch("/:id/cancel", ctrl.cancel);
router.get("/:id/history", async (req, res) => {
    try {
        const history = await statusHistoryService.getHistory(req.params.id);
        res.json(success(history));
    } catch (err) {
        res.status(500).json(failure(err.message));
    }
});
module.exports = router;