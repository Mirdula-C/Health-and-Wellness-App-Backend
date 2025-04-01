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
router.use("/auth", authRoutes); // /api/auth
router.use("/fitness", fitnessRoutes); // /api/fitness
router.use("/nutrition", nutritionRoutes); // /api/nutrition
router.use("/mentalhealth", mentalHealthRoutes); // /api/mentalhealth
router.use("/goal-tracking", goalRoutes); // /api/goal-tracking
router.use("/profile", profileRoutes); // /api/profile
router.use("/dashboard", dashboardRoutes); // /api/dashboard

module.exports = router;
