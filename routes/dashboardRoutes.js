const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Exercise = require("../models/Exercise");
const Nutrition = require("../models/Nutrition");
const MentalHealth = require("../models/MentalHealth");
const moment = require("moment");

router.get("/", (_req, res) => {
  res.json({ message: "Nutrition API is working!" });
});


// ✅ Weekly Data Route
router.get("/week", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ Date range based on the week
    const startOfWeek = moment().startOf('week').format('YYYY-MM-DD');
    const endOfWeek = moment().endOf('week').format('YYYY-MM-DD');

    console.log("Fetching data from:", startOfWeek, "to", endOfWeek);

    // ✅ Fetch fitness data
    const fitnessLogs = await Exercise.find({
      userId: userId,  
      date: { $gte: startOfWeek, $lte: endOfWeek }  
    });

    const totalDuration = fitnessLogs.reduce((acc, log) => acc + (log.duration || 0), 0);

    // ✅ Fetch nutrition data
    const nutritionLogs = await Nutrition.find({
      userId: userId,  
      date: { $gte: startOfWeek, $lte: endOfWeek }  
    });

    const totalCalories = nutritionLogs.reduce((acc, log) => acc + (log.calories || 0), 0);
    const totalProtein = nutritionLogs.reduce((acc, log) => acc + (log.protein || 0), 0);
    const totalCarbs = nutritionLogs.reduce((acc, log) => acc + (log.carbs || 0), 0);
    const totalFats = nutritionLogs.reduce((acc, log) => acc + (log.fats || 0), 0);  

    // ✅ Fetch mental health data
    const mentalLogs = await MentalHealth.find({
      userId: userId,  
      date: { $gte: new Date(startOfWeek), $lte: new Date(endOfWeek) }  
    });

    const averageMood = (
      mentalLogs.reduce((acc, log) => acc + (log.mood || 0), 0) / (mentalLogs.length || 1)
    ).toFixed(1);

    res.json({
      fitness: { totalDuration },
      nutrition: { 
        calories: totalCalories, 
        protein: totalProtein, 
        carbs: totalCarbs, 
        fats: totalFats  
      },
      mentalHealth: { averageMood }
    });

  } catch (error) {
    console.error("Error fetching weekly dashboard data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
