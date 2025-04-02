const MentalHealth = require("../models/MentalHealth");

// ✅ Log a mental health entry (Prevents duplicate entries for the same day)
exports.logMentalHealth = async (req, res) => {
  const { mood, date, journalEntry } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. User ID is missing." });
  }

  if (mood === undefined || mood < 0 || mood > 5 || !Number.isInteger(mood)) {
    return res.status(400).json({ message: "Invalid mood value." });
  }

  if (!journalEntry?.trim()) {
    return res.status(400).json({ message: "Journal entry cannot be empty." });
  }

  try {
    const entryDate = new Date(date || Date.now()).toISOString().split('T')[0]; // Ensure date consistency
    let entry = await MentalHealth.findOne({ userId, date: entryDate });

    if (entry) {
      entry.mood = mood;
      entry.journalEntry = journalEntry;
      await entry.save();
      return res.status(200).json({ message: "Entry updated successfully", entry });
    }

    entry = new MentalHealth({
      userId,
      mood,
      journalEntry,
      date: entryDate,
    });

    await entry.save();
    res.status(201).json({ message: "Mental health entry logged successfully", entry });

  } catch (error) {
    console.error("❌ Error logging mental health entry:", error);
    res.status(500).json({ message: "Failed to log entry.", error: error.message });
  }
};

// ✅ Get all mental health entries
exports.getMentalHealthEntries = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. User ID is missing." });
  }

  try {
    const entries = await MentalHealth.find({ userId }).sort({ date: -1 });

    if (!entries.length) {
      return res.status(200).json({ message: "No mental health entries found.", entries: [] });
    }

    res.status(200).json(entries);

  } catch (error) {
    console.error("❌ Error fetching mental health entries:", error);
    res.status(500).json({ message: "Failed to fetch entries.", error: error.message });
  }
};

// ✅ Delete a mental health entry by ID
exports.deleteMentalHealthEntry = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. User ID is missing." });
  }

  try {
    const entry = await MentalHealth.findOneAndDelete({ _id: id, userId });

    if (!entry) {
      return res.status(404).json({ message: "Entry not found or unauthorized." });
    }

    res.status(200).json({ message: "Entry deleted successfully." });

  } catch (error) {
    console.error("❌ Error deleting mental health entry:", error);
    res.status(500).json({ message: "Failed to delete entry.", error: error.message });
  }
};

// ✅ Weekly mood trends (progress)
exports.getMentalHealthProgress = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. User ID is missing." });
  }

  try {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const entries = await MentalHealth.find({
      userId,
      date: { $gte: startOfWeek, $lte: endOfWeek }
    });

    const chartData = {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: Array(7).fill(0),
    };

    entries.forEach((entry) => {
      const dayIndex = new Date(entry.date).getDay();
      chartData.data[dayIndex === 0 ? 6 : dayIndex - 1] = entry.mood;
    });

    res.status(200).json(chartData);

  } catch (error) {
    console.error("❌ Error fetching mental health progress:", error);
    res.status(500).json({ message: "Failed to fetch mood trends.", error: error.message });
  }
};
