const { Router } = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const { requireRole } = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");
const { ROLES } = require("../../config/constants");
const { createShipmentSchema, updateStatusSchema } = require("./shipment.validator");
const statusHistoryService = require("../status-history/statusHistory.service");
const { success, failure } = require("../../utils/response.utils");
const {
    create,
    list,
    detail,
    updateStatus,
    cancel,
    bulkCreate,
    getAnalytics,
} = require("./shipment.controller");

const router = Router();
router.use(authMiddleware);

router.get("/",                    list);
router.get("/analytics/couriers",  getAnalytics);

// ⚠️  /bulk MUST be before /:id
router.post("/bulk",               bulkCreate);
router.post("/",                   validate(createShipmentSchema), create);

router.get("/:id",                 detail);
router.get("/:id/history",         async (req, res) => {
    try {
        const history = await statusHistoryService.getHistory(req.params.id);
        res.json(success(history));
    } catch (err) {
        res.status(500).json(failure(err.message));
    }
});
router.patch("/:id/status",        requireRole(ROLES.ADMIN), validate(updateStatusSchema), updateStatus);
router.patch("/:id/cancel",        cancel);

module.exports = router;
