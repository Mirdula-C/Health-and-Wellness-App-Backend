const express = require("express");
const {
  logMentalHealth,
  getMentalHealthEntries,
  deleteMentalHealthEntry,
  getMentalHealthProgress
} = require("../controllers/mentalHealthController");
const auth = require("../middleware/auth");

const router = express.Router();


router.get("/", (_req, res) => {
  res.json({ message: "Mental Health API is working!" });
});


// ✅ Mental Health Routes
router.post("/", auth, logMentalHealth);                  // Log mental health entry
router.get("/", auth, getMentalHealthEntries);            // Get mental health entries
router.delete("/:id", auth, deleteMentalHealthEntry);     // Delete an entry
router.get("/progress", auth, getMentalHealthProgress);   // Weekly mental health progress chart

module.exports = router;
