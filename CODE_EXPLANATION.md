# Complete MERN Habit Tracker - Line-by-Line Code Explanation

## Table of Contents

1. [Backend Architecture](#backend-architecture)
2. [Database Models](#database-models)
3. [API Routes](#api-routes)
4. [Frontend Architecture](#frontend-architecture)
5. [Core Algorithms](#core-algorithms)

---

## Backend Architecture

### `backend/server.js` - Express Server Setup

```javascript
require("dotenv").config();
```

**Why:** Loads environment variables from `.env` file into `process.env`. We use this for sensitive data like `MONGODB_URI` and `JWT_SECRET` so they're not hardcoded and can differ per environment (dev, staging, production).

```javascript
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
```

**Why:**

- `express`: Web framework for building REST API routes
- `mongoose`: ODM (Object Data Model) to work with MongoDB in JavaScript
- `cors`: Enables Cross-Origin Resource Sharing so frontend (port 3000) can call backend (port 5000)
- `cron`: Schedules recurring tasks (like daily streak resets)

```javascript
const app = express();
```

**Why:** Creates the Express application instance that will handle all HTTP requests.

```javascript
app.use(cors());
app.use(express.json());
```

**Why:**

- `cors()`: Middleware that allows requests from different origins
- `express.json()`: Middleware that automatically parses incoming JSON request bodies

```javascript
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  retryWrites: false,
};
```

**Why:** Configuration options for MongoDB connection:

- `useNewUrlParser`: Uses new MongoDB connection string format
- `useUnifiedTopology`: Uses new connection pool management
- `serverSelectionTimeoutMS`: Wait max 5 seconds before failing connection
- `retryWrites: false`: Some MongoDB Atlas free tier doesn't support retries

```javascript
const mongoUri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/habit-tracker";
```

**Why:** Gets MongoDB connection string from environment variable with fallback to local MongoDB. This allows flexibility across environments.

```javascript
mongoose
  .connect(mongoUri, mongooseOptions)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.warn("MongoDB connection failed:", err.message);
    console.warn(
      "Server running but database operations will fail until MongoDB is configured"
    );
  });
```

**Why:**

- Attempts to connect to MongoDB
- `.then()`: Logs success if connected
- `.catch()`: Warns instead of crashes so server can still start (useful for debugging)

```javascript
app.use("/api/auth", require("./routes/auth"));
app.use("/api/habits", require("./routes/habits"));
app.use("/api/checkins", require("./routes/checkins"));
app.use("/api/streaks", require("./routes/streaks"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/challenges", require("./routes/challenges"));
```

**Why:** Routes all requests starting with `/api/auth` to the auth route file, `/api/habits` to habits file, etc. This organizes API endpoints by feature.

```javascript
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});
```

**Why:** Health check endpoint. Frontend/monitoring can call this to verify backend is alive without doing complex operations.

```javascript
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily streak reset...");
  // ... reset logic
});
```

**Why:** Scheduled task that runs at midnight (0 0 \* \* \* is cron syntax for midnight). Used to:

- Reset daily check-in counters
- Send reminders
- Calculate daily statistics

---

## Database Models

### `backend/models/User.js` - User Schema

```javascript
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
```

**Why:** Import Mongoose for schema definition and bcryptjs for password hashing (security best practice).

```javascript
const userSchema = new mongoose.Schema({
```

**Why:** Creates a new MongoDB schema (blueprint) for user documents.

```javascript
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
```

**Why:**

- `type: String`: Username is text
- `required: true`: Every user must have a username
- `unique: true`: MongoDB index ensures no duplicate usernames (faster login queries)
- `trim: true`: Automatically removes leading/trailing whitespace

```javascript
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
```

**Why:**

- `unique: true`: Prevents duplicate account registrations
- `lowercase: true`: Normalizes emails (User@Gmail.com = user@gmail.com) so case doesn't matter

```javascript
  password: {
    type: String,
    required: true,
    minlength: 6
  },
```

**Why:**

- `minlength: 6`: Enforces minimum password length at database level
- Will be hashed before saving (see pre-save hook below)

```javascript
  avatar: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
```

**Why:** Profile picture URL. Default provides a placeholder image if user doesn't upload one.

```javascript
  totalPoints: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
```

**Why:** Gamification fields:

- `totalPoints`: Accumulated from completed check-ins (10 points × streak multiplier)
- `level`: Calculated as `Math.floor(totalPoints / 100) + 1` (level up every 100 points)

```javascript
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
```

**Why:** Mongoose middleware that runs before saving:

- Checks if password was actually modified (skip if it wasn't)
- Generates random salt with 10 rounds (security hardness)
- Hashes password + salt (one-way encryption, can't be reversed)
- Calls `next()` to continue save operation

**Security benefit:** Never stores plain-text passwords in database. If database is hacked, passwords are still useless.

---

### `backend/models/Habit.js` - Habit Schema

```javascript
const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: { type: String },
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
    enum: ["daily", "weekly", "monthly"],
    default: "daily",
  },
  priority: { type: Number, min: 1, max: 5, default: 3 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  totalCompletions: { type: Number, default: 0 },
  reminderTime: { type: String },
  color: { type: String, default: "#667eea" },
  icon: { type: String, default: "⭐" },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});
```

**Why each field:**

- `userId`: Foreign key reference to User (establishes ownership)
- `category`: Enum restricts to predefined values (prevents invalid data)
- `frequency`: How often the habit should be done (for reminders)
- `priority`: 1-5 scale for user to prioritize habits (1=low, 5=high)
- `currentStreak`: Consecutive days completed (motivational)
- `longestStreak`: Personal best (achievement tracking)
- `reminderTime`: HH:MM format for notifications
- `color` & `icon`: UI customization
- `isActive`: Soft delete (hide without losing data)

---

### `backend/models/CheckIn.js` - Daily Check-in Records

```javascript
const checkInSchema = new mongoose.Schema({
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Habit",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  count: { type: Number, default: 1 },
  note: { type: String },
  streak: { type: Number, default: 0 },
  pointsEarned: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

checkInSchema.index({ userId: 1, habitId: 1, date: 1 });
checkInSchema.index({ userId: 1, date: 1 });
```

**Why:**

- `date`: Stores check-in date for filtering (today, this week, this month)
- `completed`: Boolean flag (quick query for "did user complete today?")
- `streak`: Denormalized streak value (stored here for quick history lookup)
- `pointsEarned`: Stores calculated points (10 × current streak length)
- **Indexes**: Create compound indexes on frequently queried combinations
  - `{ userId, habitId, date }`: Fast lookup of specific habit on specific date
  - `{ userId, date }`: Fast lookup of all check-ins for a user on a date
  - Indexes speed up queries dramatically (especially for large datasets)

---

### `backend/models/Streak.js` - Streak Tracking

```javascript
const streakSchema = new mongoose.Schema({
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: "Habit" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastCheckIn: { type: Date },
  completionDates: [Date],
  missedDates: [Date],
  updatedAt: { type: Date, default: Date.now },
});

streakSchema.index({ userId: 1, habitId: 1 });
```

**Why separate from Habit?**

- Habit has `currentStreak` and `longestStreak` (current state)
- Streak model tracks **history** (all completion dates, missed dates)
- Useful for analytics: "How many times did user miss?" or "Show calendar heatmap"

---

### `backend/models/Challenge.js` - Multi-user Competitions

```javascript
const challengeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  participants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      joinedAt: { type: Date, default: Date.now },
      completions: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
    },
  ],
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: "Habit" },
  frequency: { type: String, enum: ["daily", "weekly", "monthly"] },
  duration: { type: Number }, // days
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  rewards: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});
```

**Why array of objects for participants:**

- Each participant object stores individual progress (completions, score)
- Score calculated as `completions * 10`
- Embedded array is better than separate table here (1:N relationship with leaderboard info)

---

### `backend/models/Analytics.js` - Statistics & Insights

```javascript
const analyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: "Habit" },
  date: { type: Date },
  completionRate: { type: Number }, // 0-100%
  weeklyCompletions: [{ day: String, count: Number }],
  monthlyCompletions: [{ date: Number, count: Number }],
  averageStreak: { type: Number },
  bestDay: { type: String }, // day of week with highest completion
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

analyticsSchema.index({ userId: 1, habitId: 1, date: 1 });
```

**Why denormalize analytics?**

- Calculate completion rate, best day, average streaks periodically
- Store results so dashboard loads instantly (no complex queries on demand)
- Trade-off: Storage vs Speed

---

## API Routes

### `backend/routes/auth.js` - Authentication

```javascript
const express = require("express");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
```

**Why:**

- `express-validator`: Server-side validation (never trust client input)
- `jwt`: Creates stateless authentication tokens
- `JWT_SECRET`: Key to sign/verify tokens (must be same for all requests)

```javascript
router.post("/register", [
  body("username", "Username is required").trim().notEmpty(),
  body("email", "Valid email is required").isEmail(),
  body("password", "Password must be at least 6 characters").isLength({ min: 6 })
], async (req, res) => {
```

**Why validation chain:**

- `.trim()`: Remove whitespace
- `.notEmpty()`: Must have a value
- `.isEmail()`: Must be valid email format
- `.isLength({ min: 6 })`: Minimum password length
- Validation runs before reaching handler; saves database queries

```javascript
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}
```

**Why:** If validation failed, return 400 (Bad Request) with error details immediately.

```javascript
const { username, email, password } = req.body;

let user = await User.findOne({ $or: [{ email }, { username }] });
if (user) {
  return res.status(400).json({ error: "User already exists" });
}
```

**Why:**

- Check if user with same email OR username already exists
- `$or` operator finds document matching either condition
- Prevents duplicate registrations

```javascript
user = new User({ username, email, password });
await user.save();
```

**Why:**

- Create new User document
- `.save()` triggers the `pre-save` hook that hashes password
- Document is inserted into MongoDB

```javascript
const payload = { userId: user.id };
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

res.status(201).json({
  token,
  user: {
    id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
  },
});
```

**Why:**

- Create JWT token with userId as payload
- `expiresIn: "7d"`: Token valid for 7 days, then must re-login
- Return token + user data to frontend
- 201 = Created (resource successfully created)

**Token Flow:**

1. Frontend stores token in localStorage
2. On every request, frontend sends `Authorization: Bearer {token}`
3. Backend extracts token, verifies signature with JWT_SECRET
4. If valid, token wasn't tampered with and hasn't expired

```javascript
router.post("/login", [...], async (req, res) => {
  // ... validation

  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
```

**Why generic error message "Invalid credentials":**

- Don't say "email not found" or "password wrong"
- Prevents attackers from enumerating valid emails
- Security best practice

```javascript
const payload = { userId: user.id };
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

res.status(200).json({
  token,
  user: {
    id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
  },
});
```

**Why 200 vs 201:**

- 201 = Created (new resource made)
- 200 = OK (existing resource accessed/authenticated)

---

### `backend/routes/habits.js` - CRUD Operations

```javascript
// GET all habits for current user
router.get("/", auth, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id }).sort({
      priority: -1,
    });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Why:**

- `auth` middleware verifies JWT token and sets `req.user`
- `.find({ userId: req.user.id })`: Only return habits belonging to logged-in user
- `.sort({ priority: -1 })`: Sort by priority descending (high priority first)
- Error handling with try-catch

```javascript
// POST create habit
router.post("/", auth, [...validation...], async (req, res) => {
  const { name, description, category, frequency, priority, reminderTime, color, icon } = req.body;

  const habit = new Habit({
    userId: req.user.id,
    name,
    description,
    category,
    frequency,
    priority,
    reminderTime,
    color,
    icon
  });

  await habit.save();

  // Also create Streak record for this habit
  const streak = new Streak({ habitId: habit._id, userId: req.user.id });
  await streak.save();

  res.status(201).json(habit);
});
```

**Why create Streak immediately:**

- Ensures 1:1 relationship between Habit and Streak
- Avoid checking "does streak exist?" later
- Initialize with defaults (currentStreak: 0, longestStreak: 0)

```javascript
// GET single habit
router.get("/:id", auth, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit || habit.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    res.json(habit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Why authorization check:**

- Even if user has valid token, check they own this habit
- Prevents accessing other users' private data
- `.toString()`: Convert ObjectId to string for comparison

```javascript
// PUT update habit
router.put("/:id", auth, async (req, res) => {
  try {
    let habit = await Habit.findById(req.params.id);

    if (!habit || habit.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    habit = Object.assign(habit, req.body);
    await habit.save();

    res.json(habit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Why Object.assign:**

- Merges request body properties into existing habit
- Updates only provided fields (partial update)
- Safer than `habit = req.body` (doesn't lose fields)

```javascript
// DELETE habit
router.delete("/:id", auth, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit || habit.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Cascade delete: also delete related CheckIns and Streaks
    await CheckIn.deleteMany({ habitId: habit._id });
    await Streak.deleteMany({ habitId: habit._id });
    await Habit.findByIdAndDelete(req.params.id);

    res.json({ message: "Habit deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Why cascade delete:**

- If we delete a Habit but leave its CheckIns, data becomes orphaned
- Orphaned data wastes storage and causes query issues
- Delete all related documents to maintain referential integrity

---

### `backend/routes/checkins.js` - Daily Check-ins & Streak Calculation

```javascript
// POST create check-in (the most complex route)
router.post("/", auth, async (req, res) => {
  try {
    const { habitId } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    let checkIn = await CheckIn.findOne({ habitId, userId: req.user.id, date: today });
    if (checkIn) {
      return res.status(400).json({ error: "Already checked in today" });
    }
```

**Why normalize date:**

- `.setHours(0, 0, 0, 0)`: Set time to midnight
- Ensures consistent date comparison (ignore time component)
- "Today" always refers to same date regardless of current time

```javascript
// Calculate streak
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const yesterdayCheckIn = await CheckIn.findOne({
  habitId,
  userId: req.user.id,
  date: yesterday,
  completed: true,
});

let currentStreak = 0;

if (yesterdayCheckIn) {
  currentStreak = yesterdayCheckIn.streak + 1; // Continue streak
} else {
  // Check if there's a gap > 1 day
  const lastCheckIn = await CheckIn.findOne({
    habitId,
    userId: req.user.id,
    completed: true,
  })
    .sort({ date: -1 })
    .limit(1);

  if (lastCheckIn) {
    const daysSinceLastCheckIn = Math.floor(
      (today - lastCheckIn.date) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceLastCheckIn > 1) {
      currentStreak = 1; // Streak broken, start new
    } else {
      currentStreak = lastCheckIn.streak + 1;
    }
  } else {
    currentStreak = 1; // First check-in ever
  }
}
```

**Streak Algorithm Explanation:**

Case 1: Checked in yesterday

- Continue streak: `currentStreak = yesterdayStreak + 1`
- Example: streak was 5, now it's 6

Case 2: Didn't check in yesterday, but found recent check-in

- Calculate days gap
- If gap ≤ 1 day: Continue streak
- If gap > 1 day: Streak broken, reset to 1

Case 3: First check-in ever

- `currentStreak = 1`

**Why this matters:**

- Motivates users to maintain consistency
- Missing 1 day = forgettable/still counts
- Missing 2+ days = intentional skip, streak resets

```javascript
// Update longest streak
const streak = await Streak.findOne({ habitId, userId: req.user.id });
if (currentStreak > streak.longestStreak) {
  streak.longestStreak = currentStreak;
}
streak.currentStreak = currentStreak;
streak.lastCheckIn = today;
await streak.save();
```

**Why:**

- Track both current and longest streak
- Update lastCheckIn for analytics

```javascript
    // Award points
    const pointsEarned = 10 * currentStreak; // 10 base points × streak multiplier

    checkIn = new CheckIn({
      habitId,
      userId: req.user.id,
      date: today,
      completed: true,
      streak: currentStreak,
      pointsEarned
    });

    await checkIn.save();

    // Update user total points and level
    const user = await User.findById(req.user.id);
    user.totalPoints += pointsEarned;
    user.level = Math.floor(user.totalPoints / 100) + 1;
    await user.save();

    res.status(201).json(checkIn);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Gamification Point System:**

- `pointsEarned = 10 * streak`
  - Day 1: 10 points (10 × 1)
  - Day 5: 50 points (10 × 5)
  - Day 10: 100 points (10 × 10)
- **Level System:** `level = floor(totalPoints / 100) + 1`
  - 0-99 points = Level 1
  - 100-199 points = Level 2
  - 200-299 points = Level 3
  - This creates clear progression goals

---

### `backend/routes/streaks.js` - Leaderboards & Statistics

```javascript
// GET leaderboard - top 10 longest streaks
router.get("/leaderboard/longest", async (req, res) => {
  try {
    const leaderboard = await Streak.find()
      .sort({ longestStreak: -1 })
      .limit(10)
      .populate("userId", "username avatar level totalPoints")
      .populate("habitId", "name");

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Why:**

- `.sort({ longestStreak: -1 })`: Sort descending (highest first)
- `.limit(10)`: Only return top 10 (efficient)
- `.populate()`: Join with User/Habit collections to get names/avatars
  - Without populate: returns only ObjectIds (hard to display)
  - With populate: returns full User/Habit objects

**Query Performance:**

- Without `.limit(10)`: May fetch millions of records
- With `.limit(10)`: Database returns only 10, saves network bandwidth

```javascript
// GET user's active streaks
router.get("/active/current", auth, async (req, res) => {
  try {
    const streaks = await Streak.find({
      userId: req.user.id,
      currentStreak: { $gt: 0 }, // currentStreak greater than 0
    }).populate("habitId", "name color icon");

    res.json(streaks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Why $gt operator:**

- `{ $gt: 0 }`: MongoDB query operator "greater than"
- Finds only habits with active streaks (not 0)
- Efficient at database level (database filters, not JavaScript)

---

### `backend/routes/analytics.js` - Statistics & Insights

```javascript
// GET completion rate for habit (last 30 days)
router.get("/completion/:habitId", auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const checkIns = await CheckIn.find({
      habitId: req.params.habitId,
      userId: req.user.id,
      date: { $gte: startDate },
    });

    const completed = checkIns.filter((c) => c.completed).length;
    const completionRate = (completed / days) * 100;

    res.json({ completionRate, completed, total: days });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Why:**

- `{ $gte: startDate }`: MongoDB query "greater than or equal"
- Filters check-ins from last N days
- Calculate rate: `(completed / total) * 100`
  - Example: 20 completed in 30 days = 66.67% completion

```javascript
// GET weekly breakdown
router.get("/weekly/:habitId", auth, async (req, res) => {
  try {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const weeklyData = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);

      const checkIn = await CheckIn.findOne({
        habitId: req.params.habitId,
        userId: req.user.id,
        date,
      });

      weeklyData.push({
        day: days[date.getDay()],
        completed: checkIn ? checkIn.completed : false,
      });
    }

    res.json(weeklyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Why:**

- Calculate week start from today's date
- Loop through 7 days, building array of completion data
- Frontend uses this for weekly bar chart
- Example output:
  ```json
  [
    { day: "Sunday", completed: true },
    { day: "Monday", completed: true },
    { day: "Tuesday", completed: false },
    ...
  ]
  ```

```javascript
// GET insights - best/worst habits
router.get("/insights/performance", auth, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id });

    const habitStats = await Promise.all(
      habits.map(async (habit) => {
        const completions = await CheckIn.countDocuments({
          habitId: habit._id,
          userId: req.user.id,
          completed: true,
        });

        return {
          habitId: habit._id,
          name: habit.name,
          completions,
          completionRate: (completions / 30) * 100, // Assuming 30-day period
        };
      })
    );

    const sorted = habitStats.sort(
      (a, b) => b.completionRate - a.completionRate
    );

    res.json({
      bestHabits: sorted.slice(0, 3),
      worstHabits: sorted.slice(-3).reverse(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Why Promise.all:**

- `.map()` creates array of async promises
- `Promise.all()` waits for all promises to complete
- Avoids `await` in loop (inefficient sequential queries)
- Parallelizes database queries (faster)

**Why sort by completionRate:**

- Provides actionable insights
- Shows user which habits they're consistent with vs struggling

---

## Frontend Architecture

### `frontend/src/App.js` - Main Router & Auth Context

```javascript
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
```

**Why:**

- `useState, useEffect`: React hooks for state and side effects
- `axios`: HTTP client for API calls
- `BrowserRouter`: Client-side routing (loads pages without full refresh)
- `Routes, Route`: React Router components for defining routes
- `Navigate`: Programmatic redirect

```javascript
const API = axios.create({ baseURL: "/api" });
```

**Why:**

- Creates reusable axios instance with base URL
- All requests to `API.get("/auth/me")` become `GET /api/auth/me`
- Centralized configuration (easier to change base URL)
- Exported so all components can import and use

```javascript
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
```

**Why:**

- `user`: Stores logged-in user data
- `loading`: Prevents render until auth check completes
- `token`: JWT from localStorage (persists across page refreshes)

```javascript
useEffect(() => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    checkAuth();
  } else {
    setLoading(false);
  }
}, [token]);
```

**Why:**

- Runs when component mounts or `token` changes
- Sets Authorization header so backend can verify requests
- Calls `checkAuth()` to verify token is still valid
- If no token, immediately set loading to false

```javascript
const checkAuth = async () => {
  try {
    const response = await API.get("/auth/me");
    setUser({ userId: response.data.userId, token });
  } catch (error) {
    localStorage.removeItem("token");
    setToken(null);
  } finally {
    setLoading(false);
  }
};
```

**Why:**

- Calls backend endpoint that requires valid JWT
- If backend returns success: user is authenticated
- If 401 unauthorized: token is invalid, clear it
- `finally`: Always set loading to false (success or failure)

```javascript
const handleLogin = (token, userData) => {
  localStorage.setItem("token", token);
  setToken(token);
  setUser(userData);
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
```

**Why localStorage:**

- `localStorage` persists across browser sessions
- User stays logged in after refresh
- Alternative: `sessionStorage` (clears on browser close)

```javascript
const handleLogout = () => {
  localStorage.removeItem("token");
  setToken(null);
  setUser(null);
  delete API.defaults.headers.common["Authorization"];
};
```

**Why delete header:**

- Removes JWT from future requests
- Backend won't identify requests as authenticated

```javascript
if (loading) {
  return <div className="loading">Loading...</div>;
}
```

**Why loading state:**

- User sees "Loading..." while app checks authentication
- Prevents showing login page then immediately switching to dashboard
- Better UX (avoids flash/flicker)

```javascript
return (
  <Router>
    {user ? (
      <>
        <Navbar user={user} onLogout={handleLogout} />
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Dashboard user={user} API={API} />} />
            <Route path="/habit/:id" element={<HabitDetail API={API} />} />
            <Route path="/analytics" element={<Analytics API={API} />} />
            <Route
              path="/challenges"
              element={<Challenges API={API} user={user} />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </>
    ) : (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    )}
  </Router>
);
```

**Conditional Routing:**

- `user ? ... : ...`: If logged in, show Dashboard routes. Otherwise, show Login.
- `path="*"`: Catch-all (any unmatched route)
- `<Navigate to="/">`: Redirect unknown routes to home/login

**Why pass API to every component:**

- Centralized axios instance available everywhere
- Consistent headers and base URL across all API calls

---

### `frontend/src/pages/Login.js` - Authentication Page

```javascript
import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";

export default function Login({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
```

**Why separate state for each field:**

- Controlled components: React state drives form values
- Allows validation on individual fields
- Easy to clear form: `setEmail("")`

```javascript
const handleSignUp = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  setError("");
  setLoading(true);

  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        username,
        email,
        password,
      }
    );

    const { token, user } = response.data;
    onLogin(token, user);
  } catch (err) {
    setError(err.response?.data?.error || "Sign up failed");
  } finally {
    setLoading(false);
  }
};
```

**Why:**

- `e.preventDefault()`: Stops form submission (we handle via API)
- Validate locally before sending to server
- `.catch()`: Handle API error and display to user
- `.finally()`: Always stop loading (success or error)

```javascript
const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;
    onLogin(token, user);
  } catch (err) {
    setError(err.response?.data?.error || "Login failed");
  } finally {
    setLoading(false);
  }
};
```

**Why callback approach:**

- `onLogin()` prop lets parent (App.js) handle token/user state
- Keeps Login component focused on form logic
- Parent handles navigation/redirect after login

```javascript
  return (
    <div className="login-container">
      <div className="login-box">
        <h1>{isSignUp ? "Sign Up" : "Login"}</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
          {isSignUp && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isSignUp && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : (isSignUp ? "Sign Up" : "Login")}
          </button>
        </form>

        <p>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <a href="#" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Login" : "Sign Up"}
          </a>
        </p>
      </div>
    </div>
  );
}
```

**Why:**

- Conditional rendering: show/hide fields based on `isSignUp`
- `onChange`: Update state on every keystroke
- `disabled={loading}`: Prevent double-submit while loading
- Toggle `isSignUp` to switch between modes

---

### `frontend/src/pages/Dashboard.js` - Main Habit List

```javascript
import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import HabitCard from "../components/HabitCard";
import HabitForm from "../components/HabitForm";
import StatsOverview from "../components/StatsOverview";

export default function Dashboard({ user, API }) {
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
```

**Why:**

- `habits`: Array of user's habits
- `showForm`: Toggle create habit modal
- `loading`: Show spinner while fetching

```javascript
useEffect(() => {
  loadHabits();
}, []);

const loadHabits = async () => {
  try {
    const response = await API.get("/habits");
    setHabits(response.data);
  } catch (error) {
    console.error("Error loading habits:", error);
  } finally {
    setLoading(false);
  }
};
```

**Why useEffect with empty dependencies:**

- Runs once when component mounts
- Fetches user's habits from backend
- `.finally()`: Always stop loading

```javascript
const handleAddHabit = async (habitData) => {
  try {
    const response = await API.post("/habits", habitData);
    setHabits([...habits, response.data]);
    setShowForm(false);
  } catch (error) {
    console.error("Error creating habit:", error);
  }
};
```

**Why:**

- Posts new habit to backend
- Adds response to local `habits` array
- UI updates immediately (don't need to re-fetch all habits)
- Close form after success

```javascript
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <StatsOverview habits={habits} API={API} />

      <div className="habits-header">
        <h2>Your Habits</h2>
        <button onClick={() => setShowForm(true)}>+ Add Habit</button>
      </div>

      {showForm && (
        <HabitForm
          onSubmit={handleAddHabit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div>Loading...</div>
      ) : habits.length === 0 ? (
        <div className="no-habits">No habits yet. Create one to get started!</div>
      ) : (
        <div className="habits-grid">
          {habits.map((habit) => (
            <HabitCard key={habit._id} habit={habit} API={API} onUpdate={loadHabits} />
          ))}
        </div>
      )}
    </div>
  );
}
```

**Why:**

- Conditional rendering: show loading → empty state → habits list
- `key={habit._id}`: React uses key to track list items (improves performance)
- Pass `loadHabits` callback so HabitCard can refresh after check-in

---

### `frontend/src/components/HabitCard.js` - Individual Habit Display

```javascript
import React, { useState } from "react";
import "../styles/HabitCard.css";

export default function HabitCard({ habit, API, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await API.post("/checkins", { habitId: habit._id });
      onUpdate(); // Refresh habits list
    } catch (error) {
      alert(error.response?.data?.error || "Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this habit?")) {
      try {
        await API.delete(`/habits/${habit._id}`);
        onUpdate();
      } catch (error) {
        alert("Delete failed");
      }
    }
  };

  return (
    <div className="habit-card">
      <div className="habit-header">
        <h3>{habit.name}</h3>
        <span className="habit-icon">{habit.icon}</span>
      </div>

      <p className="habit-description">{habit.description}</p>

      <div className="habit-stats">
        <div className="stat">
          <span>Current Streak</span>
          <strong>{habit.currentStreak}</strong>
        </div>
        <div className="stat">
          <span>Longest Streak</span>
          <strong>{habit.longestStreak}</strong>
        </div>
        <div className="stat">
          <span>Total</span>
          <strong>{habit.totalCompletions}</strong>
        </div>
      </div>

      <div className="habit-actions">
        <button
          onClick={handleCheckIn}
          disabled={loading}
          className="btn-checkin"
        >
          {loading ? "..." : "Check In Today"}
        </button>
        <button onClick={handleDelete} className="btn-delete">
          Delete
        </button>
      </div>
    </div>
  );
}
```

**Why:**

- Displays single habit with stats
- `handleCheckIn`: Creates check-in record (triggers streak calculation on backend)
- `onUpdate()`: Callback to parent to refresh list
- `.confirm()`: Ask user before deleting

---

### `frontend/src/components/HabitForm.js` - Create/Edit Habit

```javascript
import React, { useState } from "react";
import "../styles/HabitForm.css";

export default function HabitForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "health",
    frequency: "daily",
    priority: 3,
    color: "#667eea",
    icon: "⭐",
    reminderTime: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="habit-form">
      <input
        type="text"
        name="name"
        placeholder="Habit Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />

      <select name="category" value={formData.category} onChange={handleChange}>
        <option value="health">Health</option>
        <option value="fitness">Fitness</option>
        <option value="learning">Learning</option>
        <option value="productivity">Productivity</option>
        <option value="mindfulness">Mindfulness</option>
        <option value="social">Social</option>
        <option value="other">Other</option>
      </select>

      <select
        name="frequency"
        value={formData.frequency}
        onChange={handleChange}
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>

      <input
        type="range"
        name="priority"
        min="1"
        max="5"
        value={formData.priority}
        onChange={handleChange}
      />

      <div className="form-actions">
        <button type="submit">Create Habit</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
```

**Why:**

- Single `formData` object instead of separate state for each field
- `handleChange`: Generic handler updates any field
- Spreads previous state: `{ ...prev, [name]: value }`
- Prevents re-renders of unchanged fields

---

### `frontend/src/components/StatsOverview.js` - Statistics Cards

```javascript
import React, { useState, useEffect } from "react";
import "../styles/StatsOverview.css";

export default function StatsOverview({ habits, API }) {
  const [stats, setStats] = useState({
    totalHabits: 0,
    activeStreaks: 0,
    maxStreak: 0,
    averageStreak: 0,
  });

  useEffect(() => {
    calculateStats();
  }, [habits]);

  const calculateStats = () => {
    const totalHabits = habits.length;
    const activeStreaks = habits.filter((h) => h.currentStreak > 0).length;
    const maxStreak = Math.max(...habits.map((h) => h.longestStreak), 0);
    const averageStreak =
      totalHabits > 0
        ? (
            habits.reduce((sum, h) => sum + h.currentStreak, 0) / totalHabits
          ).toFixed(1)
        : 0;

    setStats({ totalHabits, activeStreaks, maxStreak, averageStreak });
  };

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h4>Total Habits</h4>
        <p className="stat-value">{stats.totalHabits}</p>
      </div>
      <div className="stat-card">
        <h4>Active Streaks</h4>
        <p className="stat-value">{stats.activeStreaks}</p>
      </div>
      <div className="stat-card">
        <h4>Max Streak</h4>
        <p className="stat-value">{stats.maxStreak}</p>
      </div>
      <div className="stat-card">
        <h4>Average Streak</h4>
        <p className="stat-value">{stats.averageStreak}</p>
      </div>
    </div>
  );
}
```

**Why useEffect with habits dependency:**

- Recalculate when habits array changes
- `Math.max(...habits.map(...))`: Finds highest streak
- `.reduce()`: Sums all current streaks for average
- `.toFixed(1)`: Round to 1 decimal place

---

### `frontend/src/components/WeeklyChart.js` - Recharts Integration

```javascript
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../styles/Charts.css";

export default function WeeklyChart({ habitId, API }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadWeeklyData();
  }, [habitId]);

  const loadWeeklyData = async () => {
    try {
      const response = await API.get(`/analytics/weekly/${habitId}`);
      const chartData = response.data.map((item) => ({
        ...item,
        completions: item.completed ? 1 : 0,
      }));
      setData(chartData);
    } catch (error) {
      console.error("Error loading weekly data:", error);
    }
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="completions" fill="#667eea" name="Completed" />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

**Why Recharts:**

- Pre-built charting library (better than drawing SVG manually)
- `ResponsiveContainer`: Auto-scales to parent width
- `BarChart, Bar`: Component-based bar chart
- Tooltip on hover, legend for clarity

---

## Core Algorithms

### Streak Calculation Algorithm

```
IF checked_in_yesterday:
    new_streak = yesterday_streak + 1
ELSE IF last_check_in_exists:
    days_gap = (today - last_check_in_date) / 86400000
    IF days_gap <= 1:
        new_streak = last_check_in_streak + 1
    ELSE:
        new_streak = 1  (gap too large, streak broken)
ELSE:
    new_streak = 1  (first ever check-in)

IF new_streak > longest_streak:
    longest_streak = new_streak
```

**Why this design:**

- Flexible: allows 1-day grace period
- Motivating: consecutive days are rewarded
- Recoverable: 1-day absence doesn't lose streak

---

### Points & Level System

```
points_earned = 10 × current_streak

level = floor(total_points / 100) + 1

Examples:
- Day 1: 10 points → Level 1
- Day 10: 10 × 10 = 100 points → Level 2
- Day 20: 10 × 20 = 200 points → Level 3
```

**Why exponential multiplier:**

- Early days give small rewards (easy to start)
- Later days compound rewards (incentivizes consistency)
- User sees rapid progress initially

---

### Completion Rate Calculation

```
completion_rate = (completed_days / total_days) × 100

Examples:
- 20 completions in 30 days = 66.67%
- 15 completions in 30 days = 50%
```

**Why percentage:**

- Normalizes across different time periods
- Easy to compare habits
- Clear success metrics

---

## Security Considerations

1. **Password Hashing:** Bcryptjs with salt (10 rounds)
2. **JWT Tokens:** Expire in 7 days
3. **Authorization Checks:** Every route verifies user owns the resource
4. **Input Validation:** express-validator on server (never trust client)
5. **CORS:** Restricts requests to authorized origins
6. **Environment Variables:** Sensitive keys never in code

---

## Performance Optimizations

1. **Database Indexes:** Compound indexes on frequently queried fields
2. **Populate:** Join related collections to reduce queries
3. **Promise.all:** Parallel async operations instead of sequential
4. **Limit:** Only fetch top N results (leaderboards)
5. **LocalStorage:** Cache auth token to avoid re-login
6. **Controlled Components:** React state drives form values (avoid unnecessary DOM queries)

---

This architecture demonstrates:

- **MERN Stack:** MongoDB, Express, React, Node.js
- **RESTful API Design:** Clear endpoints, proper HTTP methods/status codes
- **Authentication:** JWT-based stateless auth
- **Database Design:** Schemas with indexes, relationships, validation
- **Frontend Patterns:** Hooks, context, component composition
- **Gamification:** Points, levels, streaks, leaderboards
- **Analytics:** Time-series data, aggregations, insights
