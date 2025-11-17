const express = require("express");
const jwt = require("jsonwebtoken");
const CheckIn = require("../models/CheckIn");
const Habit = require("../models/Habit");
const Streak = require("../models/Streak");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware
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

// Create check-in
router.post("/", verifyToken, async (req, res) => {
  try {
    const { habitId, count, note } = req.body;

    const habit = await Habit.findById(habitId);
    if (!habit || habit.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Habit not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let checkIn = await CheckIn.findOne({
      habitId,
      userId: req.userId,
      date: today,
    });

    if (checkIn) {
      checkIn.completed = true;
      checkIn.count = count || checkIn.count + 1;
      checkIn.note = note || checkIn.note;
    } else {
      checkIn = new CheckIn({
        habitId,
        userId: req.userId,
        date: today,
        completed: true,
        count: count || 1,
        note: note || "",
      });
    }

    // Calculate streak
    const streak = await Streak.findOne({ habitId, userId: req.userId });
    if (streak) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const yesterdayCheckIn = await CheckIn.findOne({
        habitId,
        userId: req.userId,
        date: yesterday,
        completed: true,
      });

      if (yesterdayCheckIn) {
        streak.currentStreak += 1;
      } else if (!yesterdayCheckIn && streak.currentStreak > 0) {
        if (streak.currentStreak > streak.longestStreak) {
          streak.longestStreak = streak.currentStreak;
        }
        streak.currentStreak = 1;
      } else {
        streak.currentStreak = 1;
      }

      streak.lastCheckIn = today;
      streak.completionDates.push(today);
      streak.updatedAt = Date.now();
      await streak.save();

      checkIn.streak = streak.currentStreak;
    }

    // Update habit
    habit.totalCompletions += 1;
    habit.currentStreak = streak ? streak.currentStreak : 1;
    habit.longestStreak = streak ? streak.longestStreak : 1;
    habit.updatedAt = Date.now();

    // Award points
    const pointsEarned = 10 * (checkIn.streak || 1);
    checkIn.pointsEarned = pointsEarned;

    const user = await User.findById(req.userId);
    user.totalPoints += pointsEarned;
    user.level = Math.floor(user.totalPoints / 100) + 1;

    await habit.save();
    await checkIn.save();
    await user.save();

    res.status(201).json({
      checkIn,
      points: pointsEarned,
      userLevel: user.level,
      userPoints: user.totalPoints,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get check-ins for habit
router.get("/habit/:habitId", verifyToken, async (req, res) => {
  try {
    const checkIns = await CheckIn.find({
      habitId: req.params.habitId,
      userId: req.userId,
    }).sort({ date: -1 });

    res.json(checkIns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get today's check-ins
router.get("/today", verifyToken, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkIns = await CheckIn.find({
      userId: req.userId,
      date: today,
    }).populate("habitId");

    res.json(checkIns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get check-ins by date range
router.get("/range", verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const checkIns = await CheckIn.find({
      userId: req.userId,
      date: { $gte: start, $lte: end },
    }).sort({ date: -1 });

    res.json(checkIns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update check-in
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const checkIn = await CheckIn.findById(req.params.id);
    if (!checkIn || checkIn.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Check-in not found" });
    }

    Object.assign(checkIn, req.body);
    await checkIn.save();

    res.json(checkIn);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete check-in
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const checkIn = await CheckIn.findById(req.params.id);
    if (!checkIn || checkIn.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Check-in not found" });
    }

    await CheckIn.findByIdAndDelete(req.params.id);
    res.json({ message: "Check-in deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
