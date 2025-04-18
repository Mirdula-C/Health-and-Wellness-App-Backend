const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

// Import routes
const rootRouter = require("./routes");

dotenv.config();
const app = express();

// ✅ Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors({
  origin: ["https://monumental-macaron-19f0a2.netlify.app"],
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
}));
app.use(morgan("dev")); 

// ✅ Default Route (Root API Endpoint)
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Health and Wellness API!" });
});

// ✅ Use Root Router
app.use("/api", rootRouter);  

// ✅ Handle undefined routes (404)
app.use((_req, res, _next) => {
  res.status(404).json({ message: "Route not found" });
});


// ✅ Centralized error handling middleware
app.use((err, _req, res, _next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// ✅ MongoDB Connection
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`✅ Connected to MongoDB`);
    app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });
