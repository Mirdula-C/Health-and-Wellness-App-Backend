const express = require("express");
const {
  logMentalHealth,
  getMentalHealthEntries,
  deleteMentalHealthEntry,
  getMentalHealthProgress
} = require("../controllers/mentalHealthController");
const auth = require("../middleware/auth");

const router = express.Router();

// ✅ API Health Check
router.get("/health", (_req, res) => {
  res.json({ message: "Mental Health API is working!" });
});

// ✅ Mental Health Routes
router.post("/", auth, logMentalHealth);                  // Log or update mental health entry
router.get("/entries", auth, getMentalHealthEntries);     // Get all mental health entries
router.delete("/:id", auth, deleteMentalHealthEntry);     // Delete a specific entry
router.get("/progress", auth, getMentalHealthProgress);   // Weekly mental health progress

module.exports = router;
