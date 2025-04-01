const express = require("express");
const { getProfile, updateProfile } = require("../controllers/profileController");
const authenticate = require("../middleware/auth");

const router = express.Router();
router.get("/", (_req, res) => {
    res.json({ message: "Profile API is working!" });
  });
  

// ✅ Fetch and update profile
router.get("/profile", authenticate, getProfile);
router.put("/update-profile", authenticate, updateProfile);

module.exports = router;
