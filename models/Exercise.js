const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  exercise: { type: String, required: true },
  duration: { type: Number, required: true },
  distance: { type: Number, default: 0 },
  date: { type: Date, required: true }   // ✅ Ensure consistent date format
}, { timestamps: true });

module.exports = mongoose.model("Exercise", exerciseSchema);
