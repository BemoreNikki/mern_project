const express = require("express");
const jwt = require("jsonwebtoken");
const Challenge = require("../models/Challenge");
const User = require("../models/User");
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

// Create challenge
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, description, duration, frequency, rewards } = req.body;

    const challenge = new Challenge({
      name,
      description,
      creatorId: req.userId,
      duration,
      frequency,
      rewards,
      endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
      participants: [
        {
          userId: req.userId,
          joinedAt: new Date(),
        },
      ],
    });

    await challenge.save();
    res.status(201).json(challenge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all challenges
router.get("/", verifyToken, async (req, res) => {
  try {
    const challenges = await Challenge.find({ isActive: true })
      .populate("creatorId", "username avatar")
      .populate("participants.userId", "username avatar")
      .sort({ createdAt: -1 });

    res.json(challenges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's challenges
router.get("/user/my-challenges", verifyToken, async (req, res) => {
  try {
    const challenges = await Challenge.find({
      "participants.userId": req.userId,
    })
      .populate("creatorId", "username avatar")
      .populate("participants.userId", "username avatar");

    res.json(challenges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Join challenge
router.post("/:id/join", verifyToken, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    const alreadyParticipant = challenge.participants.some(
      (p) => p.userId.toString() === req.userId
    );

    if (alreadyParticipant) {
      return res.status(400).json({ error: "Already joined this challenge" });
    }

    challenge.participants.push({
      userId: req.userId,
      joinedAt: new Date(),
    });

    await challenge.save();
    await challenge.populate("participants.userId", "username avatar");

    res.json(challenge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update challenge scores
router.post("/:id/update-scores", verifyToken, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge || challenge.creatorId.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Recalculate scores for all participants
    await Promise.all(
      challenge.participants.map(async (participant) => {
        const todayCheckIns = await CheckIn.countDocuments({
          userId: participant.userId,
          completed: true,
          date: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        });

        participant.completions += todayCheckIns;
        participant.score = participant.completions * 10;
      })
    );

    // Sort by score
    challenge.participants.sort((a, b) => b.score - a.score);

    await challenge.save();
    res.json(challenge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get challenge leaderboard
router.get("/:id/leaderboard", verifyToken, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id).populate(
      "participants.userId",
      "username avatar"
    );

    if (!challenge) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    const leaderboard = challenge.participants
      .sort((a, b) => b.score - a.score)
      .map((p, index) => ({
        rank: index + 1,
        user: p.userId,
        completions: p.completions,
        score: p.score,
      }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single challenge
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate("creatorId", "username avatar")
      .populate("participants.userId", "username avatar");

    if (!challenge) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    res.json(challenge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// End challenge
router.put("/:id/end", verifyToken, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge || challenge.creatorId.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    challenge.isActive = false;
    await challenge.save();

    res.json({ message: "Challenge ended", challenge });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
