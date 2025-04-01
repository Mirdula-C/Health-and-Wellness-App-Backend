const mongoose = require("mongoose");

const mentalHealthSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mood: { type: Number, required: true },            
  journalEntry: { type: String, default: "" },       
  date: { type: Date, default: Date.now }            
}, { timestamps: true });

module.exports = mongoose.model("MentalHealth", mentalHealthSchema);
