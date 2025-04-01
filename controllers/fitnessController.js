const Exercise = require("../models/Exercise");

// ✅ Log a new exercise
const logExercise = async (req, res) => {
  const { exercise, duration, distance, date } = req.body;
  const userId = req.user?.id;  

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. User ID is missing." });
  }

  if (!exercise || !duration || !date) {
    return res.status(400).json({ message: "Please fill in all required fields!" });
  }

  try {
    const newExercise = new Exercise({
      userId,
      exercise,
      duration,
      distance,
      date: date ? new Date(date) : new Date(),  
    });

    await newExercise.save();
    res.status(201).json({ message: "Exercise logged successfully!", exercise: newExercise });
  } catch (error) {
    console.error("❌ Error logging exercise:", error);
    res.status(500).json({ message: "Server error. Please try again.", error: error.message });
  }
};

// ✅ Get all exercises for the logged-in user
const getExercises = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. User ID is missing." });
  }

  try {
    const exercises = await Exercise.find({ userId }).sort({ date: -1 });
    res.status(200).json(exercises);
  } catch (error) {
    console.error("❌ Error fetching exercises:", error);
    res.status(500).json({ message: "Server error. Please try again.", error: error.message });
  }
};

// ✅ Delete an exercise
const deleteExercise = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. User ID is missing." });
  }

  try {
    const exercise = await Exercise.findById(id);

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found." });
    }

    // Ensure the user can only delete their own exercises
    if (exercise.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized. You cannot delete this exercise." });
    }

    await Exercise.findByIdAndDelete(id);
    res.status(200).json({ message: "Exercise deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting exercise:", error);
    res.status(500).json({ message: "Server error. Please try again.", error: error.message });
  }
};

// ✅ Get weekly exercise progress for the chart
const getFitnessProgress = async (req, res) => {
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

    console.log(`✅ Fetching fitness data from ${startOfWeek} to ${endOfWeek}`);

    // ✅ Find all exercises for the current week
    const exercises = await Exercise.find({
      userId,
      date: { $gte: startOfWeek, $lte: endOfWeek }
    });

    console.log("✅ Fetched Exercises:", exercises);

    // ✅ Prepare chart data
    const chartData = {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: Array(7).fill(0), 
    };

    // ✅ Populate chart data
    exercises.forEach((exercise) => {
      const dayIndex = new Date(exercise.date).getDay();
      chartData.data[dayIndex === 0 ? 6 : dayIndex - 1] += 1;  
    });

    res.status(200).json(chartData);

  } catch (error) {
    console.error("❌ Error fetching fitness progress:", error);
    res.status(500).json({ message: "Server error. Please try again.", error: error.message });
  }
};

module.exports = {
  logExercise,
  getExercises,
  deleteExercise,
  getFitnessProgress,   
};
