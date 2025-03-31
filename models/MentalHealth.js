const mongoose = require("mongoose");

const mentalHealthSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mood: { type: Number, required: true },            // Mood value (0-5)
  journalEntry: { type: String, default: "" },       // Journal text ✅ Field properly defined
  date: { type: Date, default: Date.now }            // ✅ Ensure consistent date format
}, { timestamps: true });

module.exports = mongoose.model("MentalHealth", mentalHealthSchema);
