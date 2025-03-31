const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  foodItem: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fats: { type: Number, default: 0 },
  date: { type: Date, required: true },  // ✅ Ensure consistent date format
}, { timestamps: true });

module.exports = mongoose.model("Nutrition", nutritionSchema);
