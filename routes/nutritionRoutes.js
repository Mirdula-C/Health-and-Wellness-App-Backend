const express = require("express");
const {
  logMeal,
  viewMeals,
  deleteMeal,
  getNutritionProgress
} = require("../controllers/nutritionController");
const auth = require("../middleware/auth");

const router = express.Router();

// ✅ Nutrition Routes
router.post("/log-meal", auth, logMeal);              // Log a meal
router.get("/view-nutrition", auth, viewMeals);       // View meals
router.delete("/delete-meal/:id", auth, deleteMeal);  // Delete a meal
router.get("/progress", auth, getNutritionProgress);  // Nutrition progress chart

module.exports = router;
