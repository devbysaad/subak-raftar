require("dotenv").config();
const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middleware/error.middleware");
const { startTrackingCron } = require("./modules/tracking/tracking.cron");

const authRoutes        = require("./modules/auth/auth.routes");
const userRoutes        = require("./modules/users/user.route");
const settingsRoutes    = require("./modules/settings/settings.routes");
const shipmentRoutes    = require("./modules/shipments/shipment.routes");
const integrationRoutes = require("./modules/integrations/integration.routes");
const loadSheetRoutes   = require("./modules/loadsheets/loadsheet.routes");
const complaintRoutes   = require("./modules/complaints/complaint.routes");
const invoiceRoutes     = require("./modules/invoices/invoice.routes");

const app = express();

app.use(cors({
    origin: (process.env.FRONTEND_URL || "http://localhost:3000").split(",").map(o => o.trim()),
    credentials: true,
}));

// Raw body for Shopify HMAC — must come before express.json()
app.use((req, res, next) => {
    if (req.originalUrl.includes("/integrations/shopify")) {
        express.raw({ type: "application/json" })(req, res, (err) => {
            if (err) return next(err);
            req.rawBody = req.body;
            try { req.body = JSON.parse(req.body); } catch { req.body = {}; }
            next();
        });
    } else {
        next();
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_, res) => res.json({ status: "ok" }));

app.use("/api/auth",         authRoutes);
app.use("/api/users",        userRoutes);
app.use("/api/settings",     settingsRoutes);
app.use("/api/shipments",    shipmentRoutes);
app.use("/api/loadsheets",   loadSheetRoutes);
app.use("/api/complaints",   complaintRoutes);
app.use("/api/invoices",     invoiceRoutes);
app.use("/api/integrations", integrationRoutes);

app.use(errorMiddleware);

startTrackingCron();

module.exports = app;