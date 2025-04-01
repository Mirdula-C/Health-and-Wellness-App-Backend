const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth");
const fitnessRoutes = require("./routes/fitnessRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");
const mentalHealthRoutes = require("./routes/mentalHealthRoutes");
const goalRoutes = require("./routes/goalRoutes");
const profileRoutes = require("./routes/profileRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

dotenv.config();
const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));  
app.use(morgan("dev"));

// ✅ Root Router
const rootRouter = express.Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/fitness", fitnessRoutes);
rootRouter.use("/nutrition", nutritionRoutes);
rootRouter.use("/mentalhealth", mentalHealthRoutes);
rootRouter.use("/goal-tracking", goalRoutes);
rootRouter.use("/profile", profileRoutes);
rootRouter.use("/dashboard", dashboardRoutes);

app.use("/api", rootRouter);  

// ✅ Handle undefined routes (404)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// ✅ MongoDB Connection
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });
