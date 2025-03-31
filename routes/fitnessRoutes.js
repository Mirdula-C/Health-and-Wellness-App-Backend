const express = require("express");
const {
  logExercise,
  getExercises,
  deleteExercise,
  getFitnessProgress
} = require("../controllers/fitnessController");
const auth = require("../middleware/auth");

const router = express.Router();

// ✅ Fitness Routes
router.post("/log-exercise", auth, logExercise);           // Log a new exercise
router.get("/get-exercises", auth, getExercises);          // Get all exercises
router.delete("/delete-exercise/:id", auth, deleteExercise);  // Delete an exercise
router.get("/progress", auth, getFitnessProgress);         // Weekly progress chart

module.exports = router;
