# 🚀 Quick Start Guide - Habit Tracker

## Installation & Running

### Step 1: Install Dependencies

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

### Step 2: Setup MongoDB

**Option A: Local MongoDB**

```bash
# Windows
mongod

# Mac/Linux
brew services start mongodb-community
# or
sudo systemctl start mongod
```

**Option B: MongoDB Atlas Cloud**

- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get connection string
- Update `backend/.env` with your connection string

### Step 3: Configure Backend

Create `backend/.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/habit-tracker
JWT_SECRET=your-super-secret-key-12345
PORT=5000
```

### Step 4: Start the Application

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Output: `Server running on port 5000`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm start
```

Output: Opens http://localhost:3000

## 🎯 First Time Usage

1. **Sign Up**

   - Click "Sign Up" on login page
   - Enter username, email, password
   - Create account

2. **Create Your First Habit**

   - Click "+ Add Habit" button
   - Fill in habit details:
     - Name: e.g., "Morning Exercise"
     - Category: Choose from Health, Fitness, Learning, etc.
     - Frequency: Daily/Weekly/Custom
     - Priority: 1-5 stars
     - Reminder Time: When you want to be reminded
   - Click "Create Habit"

3. **Daily Check-in**

   - On Dashboard, click "+ Check In" on any habit card
   - Habit marked as complete for today
   - Earn points and streak increases

4. **View Analytics**

   - Go to Analytics page
   - See completion rates and performance
   - Identify best and worst habits

5. **Join Challenges**
   - Go to Challenges page
   - Browse available challenges
   - Click "Join Challenge"
   - Compete with other users

## 📊 API Testing with Postman/cURL

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Habit (with token)

```bash
curl -X POST http://localhost:5000/api/habits \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Morning Run",
    "description": "30 min morning run",
    "category": "fitness",
    "frequency": "daily",
    "priority": 5,
    "reminderTime": "06:00"
  }'
```

### Check In to Habit

```bash
curl -X POST http://localhost:5000/api/checkins \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "habitId": "HABIT_ID_HERE",
    "count": 1
  }'
```

## 🐛 Troubleshooting

### Issue: "Cannot connect to MongoDB"

**Solution:**

- Verify MongoDB is running
- Check connection string in .env
- If using MongoDB Atlas, add your IP to whitelist

### Issue: "Port 5000 already in use"

**Solution:**

```bash
# Find process using port 5000
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

### Issue: Frontend can't connect to backend

**Solution:**

- Verify proxy in `frontend/package.json`: `"proxy": "http://localhost:5000"`
- Ensure backend is running on port 5000
- Check CORS is enabled in server.js

### Issue: CORS error

**Solution:**

- Backend CORS is already configured
- Check backend is running
- Try restarting both servers

## 📱 Key Features to Try

### 1. Streak Tracking

- Complete a habit daily
- Watch streak counter increase
- Check streaks page to see longest streaks

### 2. Gamification

- Earn points for each completion
- Complete habits to level up
- Create challenges to earn bonus points

### 3. Analytics

- View weekly completion charts
- See monthly progress breakdown
- Compare best vs worst habits

### 4. Challenges

- Create a challenge (e.g., "30 Day Fitness")
- Invite friends (share challenge ID)
- Compete on leaderboard

## 🎨 Customization

### Change Colors

- Edit `frontend/src/components/HabitForm.js` - default colors
- Or set custom color when creating habit

### Change Theme

- Edit `frontend/src/App.css` - background gradient
- Edit `frontend/src/styles/Navbar.css` - navbar colors

### Add More Categories

In `backend/models/Habit.js`:

```javascript
category: {
  enum: ['health', 'fitness', 'learning', 'productivity', 'mindfulness', 'social', 'other', 'finance'],
  default: 'other'
}
```

## 📚 Database Schema

Each user has:

- **Habits** - Goals user wants to track
- **Check-ins** - Daily completion records
- **Streaks** - Streak tracking data
- **Challenges** - Competitions with other users
- **Analytics** - Aggregated statistics

See README.md for detailed schema information.

## 💡 Pro Tips

1. **Set Realistic Goals** - Start with 2-3 habits
2. **Use Reminders** - Set reminder times you'll remember
3. **Be Consistent** - Check in at same time daily
4. **Track Progress** - Review analytics weekly
5. **Join Challenges** - Compete with friends for motivation

## 🆘 Need Help?

- Check console (F12) for errors
- Review terminal output for backend errors
- Check `.env` file configuration
- Ensure all dependencies installed (`npm install`)

---

**Happy tracking! Start building your habits today! 🎯**
