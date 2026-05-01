import express from "express";
import errorMiddleware from "./middleware/error.middleware.js";

import authRoutes        from "./modules/auth/auth.routes.js";
import userRoutes        from "./modules/users/user.routes.js";
import settingsRoutes    from "./modules/settings/settings.routes.js";
import shipmentRoutes    from "./modules/shipments/shipment.routes.js";
import integrationRoutes from "./modules/integrations/integration.routes.js";
import loadSheetRoutes   from "./modules/loadsheets/loadsheet.routes.js";
import complaintRoutes   from "./modules/complaints/complaint.routes.js";
import invoiceRoutes     from "./modules/invoices/invoice.routes.js";

const app = express();

// ── CORS — raw headers, always present, no cors() package ─────────
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin",      req.headers.origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods",     "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers",     "Content-Type,Authorization,Cookie,X-Requested-With");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
});

// ── Raw body for Shopify webhook ──────────────────────────────────
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

export default app;