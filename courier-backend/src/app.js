import express from "express";
import cors from "cors";
import errorMiddleware from "./middleware/error.middleware.js";

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import settingsRoutes from "./modules/settings/settings.routes.js";
import shipmentRoutes from "./modules/shipments/shipment.routes.js";
import integrationRoutes from "./modules/integrations/integration.routes.js";
import loadSheetRoutes from "./modules/loadsheets/loadsheet.routes.js";
import complaintRoutes from "./modules/complaints/complaint.routes.js";
import invoiceRoutes from "./modules/invoices/invoice.routes.js";

const app = express();

// ── CORS — must be first, before everything ──────────────────────
app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (server-to-server, curl, Postman)
        if (!origin) return callback(null, true);

        const allowed = [
            "https://subak-raftar.vercel.app",
            "https://subak-raftar-server.vercel.app",
            "http://localhost:3000",
            "http://localhost:5000",
            "http://localhost:5173",
        ];

        // also allow any vercel preview deploy URL
        if (allowed.includes(origin) || origin.endsWith(".vercel.app")) {
            return callback(null, true);
        }

        // do NOT throw — return false so Express sends proper CORS error
        return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
    optionsSuccessStatus: 204,
}));

// handle preflight for ALL routes explicitly
app.options("*", cors());

// ── raw body for Shopify webhook ─────────────────────────────────
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

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/loadsheets", loadSheetRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/integrations", integrationRoutes);

app.use(errorMiddleware);

export default app;