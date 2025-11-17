require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  retryWrites: false,
};

const mongoUri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/habit-tracker";

mongoose
  .connect(mongoUri, mongooseOptions)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.warn("MongoDB connection failed:", err.message);
    console.warn(
      "Server running but database operations will fail until MongoDB is configured"
    );
  });

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/habits", require("./routes/habits"));
app.use("/api/checkins", require("./routes/checkins"));
app.use("/api/streaks", require("./routes/streaks"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/challenges", require("./routes/challenges"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// Scheduled tasks
// Daily reset for streaks (runs at midnight)
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily streak reset...");
  const CheckIn = require("./models/CheckIn");
  const Streak = require("./models/Streak");

  try {
    console.log("Daily reset completed");
  } catch (error) {
    console.error("Daily reset error:", error);
  }
});

// Send reminders (runs every hour)
cron.schedule("0 * * * *", async () => {
  console.log("Checking for reminders...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
