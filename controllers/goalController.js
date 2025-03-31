const Goal = require("../models/Goal");

// ➡️ Get goals for a user
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.findOne({ userId: req.user.id });

    if (!goals) {
      return res.status(404).json({ message: "No goals found" });
    }

    res.status(200).json(goals);
  } catch (error) {
    console.error("❌ Error fetching goals:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ➡️ Set goals for a user
const setGoals = async (req, res) => {
  const { steps, exercise, calories, water } = req.body;

  try {
    let goal = await Goal.findOne({ userId: req.user.id });

    if (goal) {
      // Update existing goals
      goal.steps = steps;
      goal.exercise = exercise;
      goal.calories = calories;
      goal.water = water;
    } else {
      // Create new goal
      goal = new Goal({
        userId: req.user.id,
        steps,
        exercise,
        calories,
        water,
      });
    }

    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    console.error("❌ Error setting goals:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getGoals, setGoals };
