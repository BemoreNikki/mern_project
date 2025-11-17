const express = require("express");
const jwt = require("jsonwebtoken");
const Analytics = require("../models/Analytics");
const CheckIn = require("../models/CheckIn");
const Habit = require("../models/Habit");

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

// Get completion rate for habit
router.get("/completion/:habitId", verifyToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const checkIns = await CheckIn.find({
      habitId: req.params.habitId,
      userId: req.userId,
      date: { $gte: startDate },
    });

    const completed = checkIns.filter((c) => c.completed).length;
    const completionRate = ((completed / days) * 100).toFixed(1);

    res.json({ completed, total: days, completionRate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get weekly analytics
router.get("/weekly/:habitId", verifyToken, async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);

    const checkIns = await CheckIn.find({
      habitId: req.params.habitId,
      userId: req.userId,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    const weeklyData = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(day.getDate() + i);
      const dayStr = day.toISOString().split("T")[0];

      const dayCheckIns = checkIns.filter(
        (c) => c.date.toISOString().split("T")[0] === dayStr
      );

      weeklyData.push({
        date: dayStr,
        day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day.getDay()],
        completed: dayCheckIns.some((c) => c.completed),
        count: dayCheckIns.length,
        completions: dayCheckIns.filter((c) => c.completed).length,
      });
    }

    res.json(weeklyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get monthly analytics
router.get("/monthly/:habitId", verifyToken, async (req, res) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth();
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    endDate.setHours(23, 59, 59, 999);

    const checkIns = await CheckIn.find({
      habitId: req.params.habitId,
      userId: req.userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const daysInMonth = endDate.getDate();
    const completed = checkIns.filter((c) => c.completed).length;
    const completionRate = ((completed / daysInMonth) * 100).toFixed(1);

    const dailyBreakdown = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      const dayCheckIns = checkIns.filter(
        (c) => c.date.toDateString() === day.toDateString()
      );

      dailyBreakdown.push({
        date: i,
        completed: dayCheckIns.some((c) => c.completed),
        count: dayCheckIns.filter((c) => c.completed).length,
      });
    }

    res.json({
      month,
      year,
      totalDays: daysInMonth,
      completed,
      completionRate,
      dailyBreakdown,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all habits analytics (dashboard)
router.get("/dashboard/summary", verifyToken, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId });
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCheckIns = await CheckIn.find({
      userId: req.userId,
      date: today,
    });

    const analytics = await Promise.all(
      habits.map(async (habit) => {
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);
        last30Days.setHours(0, 0, 0, 0);

        const checkIns = await CheckIn.find({
          habitId: habit._id,
          userId: req.userId,
          date: { $gte: last30Days },
        });

        const completionRate = (
          (checkIns.filter((c) => c.completed).length / 30) *
          100
        ).toFixed(1);

        return {
          habitId: habit._id,
          name: habit.name,
          category: habit.category,
          currentStreak: habit.currentStreak,
          longestStreak: habit.longestStreak,
          totalCompletions: habit.totalCompletions,
          completionRate,
          isCompleteToday: todayCheckIns.some(
            (c) => c.habitId.toString() === habit._id.toString()
          ),
        };
      })
    );

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get best and worst habits
router.get("/insights/performance", verifyToken, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId });

    const performance = await Promise.all(
      habits.map(async (habit) => {
        const checkIns = await CheckIn.find({
          habitId: habit._id,
          userId: req.userId,
          completed: true,
        });

        const rate = checkIns.length / (habit.totalCompletions || 1);
        return {
          habitId: habit._id,
          name: habit.name,
          completionRate: (rate * 100).toFixed(1),
          streak: habit.currentStreak,
        };
      })
    );

    const sorted = performance.sort(
      (a, b) => b.completionRate - a.completionRate
    );

    res.json({
      bestHabits: sorted.slice(0, 5),
      worstHabits: sorted.slice(-5).reverse(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
