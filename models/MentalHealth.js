const mongoose = require("mongoose");

const mentalHealthSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true  // ✅ Index for faster lookups
    },
    mood: { 
      type: Number, 
      required: true,
      min: 0,  // ✅ Ensures mood is at least 0
      max: 5   // ✅ Ensures mood is at most 5
    },
    journalEntry: { 
      type: String, 
      trim: true,  // ✅ Removes extra spaces
      default: "" 
    },
    date: { 
      type: Date, 
      default: () => new Date(new Date().toISOString()) // ✅ Ensures UTC format
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MentalHealth", mentalHealthSchema);
