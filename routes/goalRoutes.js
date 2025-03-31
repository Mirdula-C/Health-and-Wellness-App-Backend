const express = require("express");
const { getGoals, setGoals } = require("../controllers/goalController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/get-goals", auth, getGoals);   // Fetch user goals
router.post("/set-goal", auth, setGoals);   // Set/update user goals

module.exports = router;
