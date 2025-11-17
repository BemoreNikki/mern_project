const express = require("express");
const jwt = require("jsonwebtoken");
const Streak = require("../models/Streak");
const CheckIn = require("../models/CheckIn");

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

// Get all streaks for user
router.get("/", verifyToken, async (req, res) => {
  try {
    const streaks = await Streak.find({ userId: req.userId })
      .populate("habitId")
      .sort({ currentStreak: -1 });

    res.json(streaks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get streak for specific habit
router.get("/:habitId", verifyToken, async (req, res) => {
  try {
    const streak = await Streak.findOne({
      habitId: req.params.habitId,
      userId: req.userId,
    });

    if (!streak) {
      return res.status(404).json({ error: "Streak not found" });
    }

    res.json(streak);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get longest streaks (leaderboard)
router.get("/leaderboard/longest", verifyToken, async (req, res) => {
  try {
    const streaks = await Streak.find({ userId: req.userId })
      .populate("habitId")
      .sort({ longestStreak: -1 })
      .limit(10);

    res.json(streaks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current active streaks
router.get("/active/current", verifyToken, async (req, res) => {
  try {
    const streaks = await Streak.find({
      userId: req.userId,
      currentStreak: { $gt: 0 },
    })
      .populate("habitId")
      .sort({ currentStreak: -1 });

    res.json(streaks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get streak statistics
router.get("/stats/summary", verifyToken, async (req, res) => {
  try {
    const streaks = await Streak.find({ userId: req.userId });

    const totalHabits = streaks.length;
    const activeStreaks = streaks.filter((s) => s.currentStreak > 0).length;
    const maxStreak = Math.max(...streaks.map((s) => s.longestStreak), 0);
    const averageStreak =
      streaks.length > 0
        ? (
            streaks.reduce((sum, s) => sum + s.currentStreak, 0) /
            streaks.length
          ).toFixed(1)
        : 0;

    res.json({
      totalHabits,
      activeStreaks,
      maxStreak,
      averageStreak,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
