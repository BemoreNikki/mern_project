# 🎯 Habit Tracker - MERN Application

A comprehensive habit tracking application built with MERN stack (MongoDB, Express, React, Node.js) featuring streak tracking, analytics, challenges, and gamification.

## ✨ Features

### Core Features

- ✅ **Create Custom Habits** - Define habits with custom categories, priorities, and reminders
- ✅ **Daily Check-in System** - Mark habits as complete each day with notes
- ✅ **Streak Tracking** - Track current and longest streaks with visual feedback
- ✅ **Visual Progress Charts** - Weekly and monthly progress visualization
- ✅ **Habit Categories** - Organize habits (Health, Fitness, Learning, Productivity, Mindfulness, Social)
- ✅ **Priority System** - Set priority levels from 1-5
- ✅ **Reminder Notifications** - Schedule daily reminders at custom times

### Analytics & Insights

- 📊 **Completion Rate** - Track success rate for each habit
- 📈 **Performance Dashboard** - Overview of all habits' statistics
- 🏆 **Best & Worst Habits** - Identify which habits you're succeeding at
- 📅 **Time-Series Data** - Historical data for trend analysis
- 🔥 **Streak Statistics** - Overall streak metrics and leaderboards

### Gamification

- 💎 **Points System** - Earn points for completing habits
- 📊 **User Levels** - Progress through levels based on points
- 🎮 **Challenge Mode** - Create and join challenges with friends
- 👥 **Leaderboards** - Compete with others on challenges
- 🎯 **Rewards** - Set custom rewards for challenges

### Scheduled Tasks

- ⏰ **Automated Reminders** - Cron jobs for daily reminders
- 🔄 **Daily Reset** - Automatic daily streak management

## 🏗️ Project Structure

```
mern_project/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema with authentication
│   │   ├── Habit.js         # Habit configuration
│   │   ├── CheckIn.js       # Daily check-in records
│   │   ├── Streak.js        # Streak tracking
│   │   ├── Challenge.js     # Challenge data
│   │   └── Analytics.js     # Analytics aggregation
│   ├── routes/
│   │   ├── auth.js          # Authentication endpoints
│   │   ├── habits.js        # Habit CRUD operations
│   │   ├── checkins.js      # Check-in management
│   │   ├── streaks.js       # Streak queries
│   │   ├── analytics.js     # Analytics endpoints
│   │   └── challenges.js    # Challenge management
│   ├── server.js            # Express server setup
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Dashboard.js
    │   │   ├── HabitDetail.js
    │   │   ├── Analytics.js
    │   │   └── Challenges.js
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── HabitCard.js
    │   │   ├── HabitForm.js
    │   │   ├── StatsOverview.js
    │   │   ├── WeeklyChart.js
    │   │   ├── MonthlyChart.js
    │   │   ├── ChallengeCard.js
    │   │   └── ChallengeForm.js
    │   ├── styles/
    │   │   ├── Login.css
    │   │   ├── Dashboard.css
    │   │   ├── Navbar.css
    │   │   ├── HabitCard.css
    │   │   ├── HabitForm.css
    │   │   ├── HabitDetail.css
    │   │   ├── Charts.css
    │   │   ├── Challenges.css
    │   │   └── ChallengeCard.css
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## 🛠️ Tech Stack

### Backend

- **Express.js** - REST API framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **node-cron** - Scheduled tasks
- **express-validator** - Input validation

### Frontend

- **React 18** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **date-fns** - Date utilities
- **Lucide React** - Icons

## 📋 Setup Instructions

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Install dependencies:**

   ```bash
   cd backend
   npm install
   ```

2. **Configure environment:**
   Create `.env` file in backend directory:

   ```env
   MONGODB_URI=mongodb://localhost:27017/habit-tracker
   JWT_SECRET=your-secret-key-change-this-in-production
   PORT=5000
   ```

3. **Start server:**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies:**

   ```bash
   cd frontend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```
   App opens at `http://localhost:3000`

## 🚀 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Habits

- `GET /api/habits` - Get all habits
- `POST /api/habits` - Create habit
- `GET /api/habits/:id` - Get habit details
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit
- `GET /api/habits/category/:category` - Get habits by category

### Check-ins

- `POST /api/checkins` - Create check-in
- `GET /api/checkins/habit/:habitId` - Get check-ins for habit
- `GET /api/checkins/today` - Get today's check-ins
- `GET /api/checkins/range` - Get check-ins by date range
- `PUT /api/checkins/:id` - Update check-in
- `DELETE /api/checkins/:id` - Delete check-in

### Streaks

- `GET /api/streaks` - Get all streaks
- `GET /api/streaks/:habitId` - Get streak for habit
- `GET /api/streaks/leaderboard/longest` - Longest streaks
- `GET /api/streaks/active/current` - Active streaks
- `GET /api/streaks/stats/summary` - Streak statistics

### Analytics

- `GET /api/analytics/completion/:habitId` - Completion rate
- `GET /api/analytics/weekly/:habitId` - Weekly data
- `GET /api/analytics/monthly/:habitId` - Monthly data
- `GET /api/analytics/dashboard/summary` - Dashboard overview
- `GET /api/analytics/insights/performance` - Performance insights

### Challenges

- `POST /api/challenges` - Create challenge
- `GET /api/challenges` - Get all challenges
- `GET /api/challenges/user/my-challenges` - Get user's challenges
- `POST /api/challenges/:id/join` - Join challenge
- `POST /api/challenges/:id/update-scores` - Update challenge scores
- `GET /api/challenges/:id/leaderboard` - Challenge leaderboard
- `PUT /api/challenges/:id/end` - End challenge

## 📊 Data Models

### User

```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  avatar: String,
  totalPoints: Number,
  level: Number,
  createdAt: Date
}
```

### Habit

```javascript
{
  userId: ObjectId,
  name: String,
  description: String,
  category: String,
  frequency: String,
  priority: Number,
  currentStreak: Number,
  longestStreak: Number,
  totalCompletions: Number,
  reminderTime: String,
  color: String,
  icon: String,
  createdAt: Date
}
```

### CheckIn

```javascript
{
  habitId: ObjectId,
  userId: ObjectId,
  date: Date,
  completed: Boolean,
  count: Number,
  note: String,
  streak: Number,
  pointsEarned: Number,
  createdAt: Date
}
```

### Streak

```javascript
{
  habitId: ObjectId,
  userId: ObjectId,
  currentStreak: Number,
  longestStreak: Number,
  lastCheckIn: Date,
  completionDates: [Date],
  missedDates: [Date],
  updatedAt: Date
}
```

### Challenge

```javascript
{
  name: String,
  description: String,
  creatorId: ObjectId,
  participants: [{
    userId: ObjectId,
    joinedAt: Date,
    completions: Number,
    score: Number
  }],
  frequency: String,
  duration: Number,
  startDate: Date,
  endDate: Date,
  rewards: String,
  isActive: Boolean,
  createdAt: Date
}
```

## 🎮 Key Features Explanation

### Streak System

- Streaks increase by 1 for each consecutive day completed
- If missed a day, streak resets to 0
- Longest streak is tracked separately
- Points awarded based on streak multiplier

### Analytics

- Completion rate calculated over last 30 days
- Weekly breakdowns for each day of the week
- Monthly calendar view with daily completions
- Performance insights comparing best and worst habits

### Challenges

- Users can create and join challenges
- Challenge duration in days
- Points awarded per completion in challenge
- Leaderboard shows ranked participants
- Challenges end automatically after duration

### Gamification

- 10 base points per completion
- Streak multiplier: 10 \* streak_length
- Level up every 100 points
- Visual indicators for milestones

## 🔒 Security

- JWT token-based authentication
- Password hashing with bcryptjs
- Protected API endpoints with middleware
- Input validation with express-validator
- CORS enabled for frontend

## 🐛 Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running
- Check connection string in .env
- Verify database credentials

### CORS Issues

- Check proxy setting in frontend package.json
- Verify backend CORS configuration

### Port Already in Use

- Change PORT in .env file
- Kill process using the port

## 📝 Future Enhancements

- [ ] Push notifications for reminders
- [ ] Social sharing of achievements
- [ ] Habit templates library
- [ ] Mobile app with React Native
- [ ] Advanced statistics and ML predictions
- [ ] Habit import/export
- [ ] Dark theme
- [ ] Multi-language support

## 📄 License

MIT License - feel free to use this project for learning and personal use.

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue in the repository.

---

**Happy habit tracking! 🚀**
