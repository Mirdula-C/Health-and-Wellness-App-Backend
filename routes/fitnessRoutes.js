const express = require("express");
const {
  logExercise,
  getExercises,
  deleteExercise,
  getFitnessProgress
} = require("../controllers/fitnessController");
const auth = require("../middleware/auth");

const router = express.Router();


// ✅ Add a root route to check if `/api/fitness` is accessible
router.get("/", (req, res) => {
  res.json({ message: "Fitness API is working!" });
});

// ✅ Fitness Routes
router.post("/log-exercise", auth, logExercise);           // Log a new exercise
router.get("/get-exercises", auth, getExercises);          // Get all exercises
router.delete("/delete-exercise/:id", auth, deleteExercise);  // Delete an exercise
router.get("/progress", auth, getFitnessProgress);         // Weekly progress chart

module.exports = router;
