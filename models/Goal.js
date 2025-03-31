const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  steps: { type: Number, default: 0 },
  exercise: { type: Number, default: 0 },
  calories: { type: Number, default: 0 },
  water: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Goal", goalSchema);
