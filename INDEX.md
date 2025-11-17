# 🎯 Habit Tracker - MERN Application

## Complete Project Documentation Index

Welcome! This is a **production-ready habit tracking application** built with the MERN stack (MongoDB, Express, React, Node.js). Below is your complete guide to the project.

---

## 📚 Documentation Files

### 🚀 **Getting Started**

- **[QUICKSTART.md](./QUICKSTART.md)** - Fast setup in 5 minutes
  - Installation steps
  - Running both servers
  - First-time usage
  - API testing with cURL
  - Troubleshooting

### 📖 **Setup & Installation**

- **[SETUP.md](./SETUP.md)** - Complete setup guide
  - Prerequisites checklist
  - Step-by-step installation
  - Database configuration
  - Development workflow
  - Production deployment
  - Performance optimization

### 🏗️ **Architecture & Design**

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical deep dive
  - System architecture diagram
  - Data flow diagrams
  - Database schema details
  - Authentication flow
  - Streak algorithm
  - Scalability considerations

### 📋 **Project Overview**

- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - What's been built
  - Feature checklist
  - File structure
  - Dependencies
  - Key metrics
  - Learning outcomes

### 📚 **Complete Documentation**

- **[README.md](./README.md)** - Full project guide
  - All features explained
  - Complete API reference
  - Data models
  - Tech stack details

---

## ⚡ Quick Start

### 1. **Install & Run (5 minutes)**

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (new terminal)
cd frontend && npm install && npm start
```

### 2. **Access Application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- MongoDB: mongodb://localhost:27017/habit-tracker

### 3. **Create Your First Habit**

1. Sign up at login screen
2. Click "Add Habit"
3. Fill in habit details
4. Click "Create Habit"
5. Click "Check In" to start tracking

---

## 🎯 Key Features

### ✅ Core Features

- Custom habit creation
- Daily check-in system
- Streak tracking with visual feedback
- Weekly & monthly progress charts
- Habit categorization
- Priority levels
- Reminder notifications

### 📊 Analytics

- Completion rate tracking
- Time-series data visualization
- Performance insights
- Best/worst habits comparison
- Statistical analysis

### 🎮 Gamification

- Points system (10 base + streak multiplier)
- User levels (every 100 points = 1 level)
- Challenge mode with leaderboards
- Multiplayer competitions

### ⏰ Automation

- Scheduled reminders (cron jobs)
- Daily streak reset
- Automatic point calculation

---

## 🗂️ Project Structure

```
mern_project/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Habit.js
│   │   ├── CheckIn.js
│   │   ├── Streak.js
│   │   ├── Challenge.js
│   │   └── Analytics.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── habits.js
│   │   ├── checkins.js
│   │   ├── streaks.js
│   │   ├── analytics.js
│   │   └── challenges.js
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── HabitDetail.js
│   │   │   ├── Analytics.js
│   │   │   └── Challenges.js
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── HabitCard.js
│   │   │   ├── HabitForm.js
│   │   │   ├── StatsOverview.js
│   │   │   ├── WeeklyChart.js
│   │   │   ├── MonthlyChart.js
│   │   │   ├── ChallengeCard.js
│   │   │   └── ChallengeForm.js
│   │   ├── styles/
│   │   │   └── (11 CSS files)
│   │   ├── App.js
│   │   └── index.js
│   └── public/
│
└── Documentation/
    ├── README.md
    ├── QUICKSTART.md
    ├── SETUP.md
    ├── ARCHITECTURE.md
    ├── PROJECT_SUMMARY.md
    └── INDEX.md (this file)
```

---

## 📊 File Statistics

| Category                    | Count | Details                                                                   |
| --------------------------- | ----- | ------------------------------------------------------------------------- |
| Backend Models              | 6     | User, Habit, CheckIn, Streak, Challenge, Analytics                        |
| Backend Routes              | 6     | auth, habits, checkins, streaks, analytics, challenges                    |
| Frontend Pages              | 5     | Login, Dashboard, HabitDetail, Analytics, Challenges                      |
| Frontend Components         | 8     | Navbar, HabitCard, HabitForm, StatsOverview, Charts, Challenge components |
| CSS Files                   | 11    | Styling for all components                                                |
| Total TypeScript/JavaScript | 35+   | Production-ready code                                                     |
| API Endpoints               | 50+   | Full CRUD operations                                                      |
| Documentation Pages         | 6     | Comprehensive guides                                                      |

---

## 🚀 Technology Stack

### Backend

```
Express.js          - REST API framework
MongoDB + Mongoose  - Database & ODM
Node.js             - Runtime
JWT                 - Authentication
bcryptjs            - Password hashing
node-cron           - Scheduled tasks
express-validator   - Input validation
CORS                - Cross-origin support
```

### Frontend

```
React 18            - UI library
React Router        - Navigation
Axios               - HTTP client
Recharts            - Data visualization
date-fns            - Date utilities
CSS3                - Styling
```

---

## 🔑 Key Concepts Covered

### 1. **Time-Series Data**

- Daily check-in records
- Historical tracking
- Data aggregation
- Trend analysis

### 2. **Data Visualization**

- Weekly bar charts
- Monthly line charts
- Progress indicators
- Leaderboards

### 3. **Statistics Calculation**

- Completion rates
- Streak algorithms
- Performance metrics
- Pattern detection

### 4. **Scheduled Tasks**

- Cron job scheduling
- Daily reminders
- Automated reset

### 5. **Authentication & Security**

- JWT token management
- Password hashing
- Protected routes
- Input validation

---

## 🎓 Learning Path

### Beginner

1. Read QUICKSTART.md
2. Run the application
3. Create a few habits
4. Explore the UI

### Intermediate

1. Read README.md
2. Study the API endpoints
3. Test with Postman
4. Modify frontend styling

### Advanced

1. Read ARCHITECTURE.md
2. Study the data models
3. Understand the streak algorithm
4. Implement new features
5. Deploy to production

---

## 🔌 API Endpoints Overview

### Authentication

- `POST /api/auth/register` - Sign up
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Get current user

### Habits

- `GET /api/habits` - List habits
- `POST /api/habits` - Create habit
- `GET /api/habits/:id` - Get habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit

### Check-ins

- `POST /api/checkins` - Create check-in
- `GET /api/checkins/today` - Today's check-ins
- `GET /api/checkins/range` - Date range query
- `GET /api/checkins/habit/:habitId` - Habit check-ins

### Analytics

- `GET /api/analytics/completion/:habitId` - Completion rate
- `GET /api/analytics/weekly/:habitId` - Weekly data
- `GET /api/analytics/monthly/:habitId` - Monthly data
- `GET /api/analytics/dashboard/summary` - Overview
- `GET /api/analytics/insights/performance` - Performance

### Streaks

- `GET /api/streaks` - All streaks
- `GET /api/streaks/:habitId` - Single streak
- `GET /api/streaks/stats/summary` - Summary stats
- `GET /api/streaks/leaderboard/longest` - Top streaks

### Challenges

- `POST /api/challenges` - Create challenge
- `GET /api/challenges` - List challenges
- `POST /api/challenges/:id/join` - Join challenge
- `GET /api/challenges/:id/leaderboard` - Leaderboard

---

## 💡 Usage Examples

### Create a Habit

```bash
curl -X POST http://localhost:5000/api/habits \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Morning Run",
    "category": "fitness",
    "frequency": "daily",
    "priority": 5,
    "reminderTime": "06:00"
  }'
```

### Check In to a Habit

```bash
curl -X POST http://localhost:5000/api/checkins \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "habitId": "HABIT_ID",
    "count": 1
  }'
```

### Get Analytics

```bash
curl -X GET http://localhost:5000/api/analytics/dashboard/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🐛 Troubleshooting

### Common Issues

| Issue                  | Solution                               |
| ---------------------- | -------------------------------------- |
| Port 5000 in use       | Change PORT in .env or kill process    |
| MongoDB not connecting | Verify mongod is running               |
| CORS error             | Check backend is running on 5000       |
| Frontend can't connect | Restart both servers                   |
| npm install fails      | Clear cache: `npm cache clean --force` |

See [SETUP.md](./SETUP.md) for detailed troubleshooting.

---

## 🚀 Next Steps

### Development

1. ✅ Install and run locally
2. ✅ Create test habits
3. ✅ Test all features
4. ✅ Review the code
5. ✅ Modify and customize

### Production

1. Configure environment variables
2. Set up MongoDB Atlas
3. Build frontend: `npm run build`
4. Deploy backend (Heroku, Railway, etc.)
5. Deploy frontend (Vercel, Netlify, etc.)

### Enhancement Ideas

- Add push notifications
- Implement social features
- Add export/import functionality
- Create mobile app
- Add advanced analytics
- Implement ML predictions

---

## 📞 Support & Resources

### Documentation

- [Express.js Docs](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [React Docs](https://react.dev)
- [Recharts Docs](https://recharts.org)

### Tools

- [Postman](https://www.postman.com) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [VS Code](https://code.visualstudio.com) - Code editor

### Deployment

- [Heroku](https://www.heroku.com) - Backend hosting
- [Vercel](https://vercel.com) - Frontend hosting
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Database

---

## 📄 License

MIT License - Free to use and modify for personal and commercial projects.

---

## 🎉 Getting Started Now

Choose your path:

### 🏃 **I just want to run it** (5 min)

→ Go to [QUICKSTART.md](./QUICKSTART.md)

### 🔧 **I want detailed setup** (15 min)

→ Go to [SETUP.md](./SETUP.md)

### 🏗️ **I want to understand the architecture** (30 min)

→ Go to [ARCHITECTURE.md](./ARCHITECTURE.md)

### 📖 **I want complete reference** (1 hour)

→ Read [README.md](./README.md)

---

**Happy habit tracking! Start building today. 🚀🎯**

_Created with ❤️ as a comprehensive MERN learning project_
