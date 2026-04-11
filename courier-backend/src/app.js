const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middleware/error.middleware");
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.route");
const companyRoutes = require("./modules/companies/company.routes");
const shipmentRoutes = require("./modules/shipments/shipment.routes");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/shipments", shipmentRoutes);

app.use(errorMiddleware);

module.exports = app;