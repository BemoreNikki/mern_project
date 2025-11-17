const express = require("express");
const jwt = require("jsonwebtoken");
const Habit = require("../models/Habit");
const Streak = require("../models/Streak");
const CheckIn = require("../models/CheckIn");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Create habit
router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      frequency,
      frequencyDays,
      priority,
      reminderTime,
    } = req.body;

    const habit = new Habit({
      userId: req.userId,
      name,
      description,
      category,
      frequency,
      frequencyDays,
      priority,
      reminderTime,
    });

    await habit.save();

    // Create streak record
    const streak = new Streak({
      userId: req.userId,
      habitId: habit._id,
    });
    await streak.save();

    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all habits for user
router.get("/", verifyToken, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId }).sort({
      priority: -1,
    });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single habit
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || habit.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Habit not found" });
    }
    res.json(habit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update habit
router.put("/:id", verifyToken, async (req, res) => {
  try {
    let habit = await Habit.findById(req.params.id);
    if (!habit || habit.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Habit not found" });
    }

    habit = Object.assign(habit, req.body);
    habit.updatedAt = Date.now();
    await habit.save();

    res.json(habit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete habit
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || habit.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Habit not found" });
    }

    await Habit.findByIdAndDelete(req.params.id);
    await Streak.deleteOne({ habitId: req.params.id });
    await CheckIn.deleteMany({ habitId: req.params.id });

    res.json({ message: "Habit deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get habits by category
router.get("/category/:category", verifyToken, async (req, res) => {
  try {
    const habits = await Habit.find({
      userId: req.userId,
      category: req.params.category,
    });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
