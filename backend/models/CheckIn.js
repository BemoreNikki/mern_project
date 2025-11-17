const mongoose = require("mongoose");

const checkInSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    default: () => new Date().setHours(0, 0, 0, 0),
  },
  completed: {
    type: Boolean,
    default: false,
  },
  count: {
    type: Number,
    default: 0,
  },
  note: {
    type: String,
    default: "",
  },
  streak: {
    type: Number,
    default: 0,
  },
  pointsEarned: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
checkInSchema.index({ userId: 1, habitId: 1, date: -1 });
checkInSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model("CheckIn", checkInSchema);
