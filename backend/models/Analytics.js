const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Habit",
    required: true,
  },
  date: {
    type: Date,
    default: () => new Date().setHours(0, 0, 0, 0),
  },
  completionRate: {
    type: Number,
    default: 0,
  },
  weeklyCompletions: {
    type: Number,
    default: 0,
  },
  monthlyCompletions: {
    type: Number,
    default: 0,
  },
  averageStreak: {
    type: Number,
    default: 0,
  },
  bestDay: {
    type: String,
    default: "Monday",
  },
  notes: {
    type: String,
    default: "",
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

analyticsSchema.index({ userId: 1, habitId: 1, date: -1 });

module.exports = mongoose.model("Analytics", analyticsSchema);
