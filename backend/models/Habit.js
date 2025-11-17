const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    enum: [
      "health",
      "fitness",
      "learning",
      "productivity",
      "mindfulness",
      "social",
      "other",
    ],
    default: "other",
  },
  frequency: {
    type: String,
    enum: ["daily", "weekly", "custom"],
    default: "daily",
  },
  frequencyDays: {
    type: Number,
    default: 1,
  },
  targetCount: {
    type: Number,
    default: 1,
  },
  unit: {
    type: String,
    default: "times",
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
  },
  color: {
    type: String,
    default: "#3B82F6",
  },
  icon: {
    type: String,
    default: "✓",
  },
  currentStreak: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  totalCompletions: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  reminderTime: {
    type: String,
    default: "09:00",
  },
  reminderEnabled: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Habit", habitSchema);
