const mongoose = require("mongoose");

const streakSchema = new mongoose.Schema({
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Habit",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  currentStreak: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  lastCheckIn: {
    type: Date,
    default: null,
  },
  completionDates: [
    {
      type: Date,
      default: Date.now,
    },
  ],
  missedDates: [
    {
      type: Date,
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

streakSchema.index({ userId: 1, habitId: 1 });

module.exports = mongoose.model("Streak", streakSchema);
