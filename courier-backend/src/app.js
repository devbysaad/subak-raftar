require("dotenv").config();
const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middleware/error.middleware");
const { startTrackingCron } = require("./modules/tracking/tracking.cron");

// routes
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.route");
const companyRoutes = require("./modules/companies/company.routes");
const shipmentRoutes = require("./modules/shipments/shipment.routes");
const integrationRoutes = require("./modules/integrations/integration.routes");

const app = express();

app.use(cors({
  origin: (process.env.FRONTEND_URL || "http://localhost:3000").split(",").map(o => o.trim()),
  credentials: true,
}));

// raw body needed for Shopify webhook signature verification
// must be before express.json()
app.use((req, res, next) => {
  if (req.originalUrl.includes("/integrations/shopify")) {
    express.raw({ type: "application/json" })(req, res, (err) => {
      if (err) return next(err);
      req.rawBody = req.body;
      req.body = JSON.parse(req.body);
      next();
    });
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/integrations", integrationRoutes);

// global error handler — must be last
app.use(errorMiddleware);

// start cron job
startTrackingCron();

module.exports = app;