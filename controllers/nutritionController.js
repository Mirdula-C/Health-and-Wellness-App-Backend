const Nutrition = require("../models/Nutrition");

// ✅ Log a new meal
exports.logMeal = async (req, res) => {
  const { foodItem, calories, protein, carbs, fats, date } = req.body;
  const userId = req.user?.id;  // Get user ID from token

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. User ID is missing." });
  }

  try {
    const meal = new Nutrition({
      userId,
      foodItem,
      calories,
      protein,
      carbs,
      fats,
      date: date ? new Date(date) : new Date(),
    });

    await meal.save();
    res.status(201).json({ message: "Meal logged successfully", meal });
  } catch (error) {
    console.error("❌ Error logging meal:", error);
    res.status(500).json({ message: "Server error while logging meal.", error: error.message });
  }
};

// ✅ View all meals for the logged-in user
exports.viewMeals = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. User ID is missing." });
  }

  try {
    const meals = await Nutrition.find({ userId }).sort({ date: -1 });
    res.status(200).json(meals);
  } catch (error) {
    console.error("❌ Error fetching meals:", error);
    res.status(500).json({ message: "Failed to fetch meals.", error: error.message });
  }
};

// ✅ Delete a meal by ID
exports.deleteMeal = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. User ID is missing." });
  }

  try {
    const meal = await Nutrition.findOneAndDelete({ _id: id, userId });

    if (!meal) {
      return res.status(404).json({ message: "Meal not found or unauthorized." });
    }

    res.status(200).json({ message: "Meal deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting meal:", error);
    res.status(500).json({ message: "Failed to delete meal.", error: error.message });
  }
};

// ✅ Get weekly nutrition breakdown for the chart
exports.getNutritionProgress = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. User ID is missing." });
  }

  try {
    // ✅ Get the date range for the current week (Monday to Sunday)
    const today = new Date();
    const dayOfWeek = today.getDay();

    // Get Monday of the current week
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    startOfWeek.setHours(0, 0, 0, 0);

    // Get Sunday of the current week
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    console.log(`✅ Fetching nutrition data from ${startOfWeek} to ${endOfWeek}`);

    // ✅ Find all meals for the current week
    const meals = await Nutrition.find({
      userId,
      date: { $gte: startOfWeek, $lte: endOfWeek }
    });

    console.log("✅ Fetched Meals:", meals);

    if (!meals || meals.length === 0) {
      return res.status(200).json({
        labels: ["Carbs", "Proteins", "Fats"],
        data: [0, 0, 0],  // Return empty chart if no data
        message: "No nutrition data found for this week."
      });
    }

    // ✅ Initialize totals
    let totalCalories = 0;
    let totalCarbs = 0;
    let totalProteins = 0;
    let totalFats = 0;

    // ✅ Aggregate weekly nutrition data
    meals.forEach((meal) => {
      totalCalories += meal.calories || 0;
      totalCarbs += meal.carbs || 0;
      totalProteins += meal.protein || 0;  
      totalFats += meal.fats || 0;
    });

    console.log("✅ Aggregated Data:", { totalCalories, totalCarbs, totalProteins, totalFats });

    // ✅ Prepare chart data
    const chartData = {
      labels: ["Carbs", "Proteins", "Fats"],
      data: [totalCarbs, totalProteins, totalFats],
    };

    res.status(200).json(chartData);

  } catch (error) {
    console.error("❌ Error fetching nutrition progress:", error);
    res.status(500).json({ message: "Failed to fetch nutrition trends.", error: error.message });
  }
};
