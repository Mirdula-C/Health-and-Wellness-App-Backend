const express = require("express");
const router = express.Router();

// Import individual route modules
const authRoutes = require("./auth");
const fitnessRoutes = require("./fitnessRoutes");
const nutritionRoutes = require("./nutritionRoutes");
const mentalHealthRoutes = require("./mentalHealthRoutes");
const goalRoutes = require("./goalRoutes");
const profileRoutes = require("./profileRoutes");
const dashboardRoutes = require("./dashboardRoutes");

// ✅ Use individual routes with specific prefixes
router.use("/auth", authRoutes);
router.use("/fitness", fitnessRoutes);
router.use("/nutrition", nutritionRoutes);
router.use("/mentalhealth", mentalHealthRoutes);
router.use("/goal-tracking", goalRoutes);
router.use("/profile", profileRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
