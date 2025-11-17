# 🚀 Complete Setup & Deployment Guide

## 📋 Prerequisites Checklist

- [ ] Node.js v14+ installed
- [ ] npm or yarn installed
- [ ] MongoDB installed or MongoDB Atlas account
- [ ] Code editor (VS Code recommended)
- [ ] Git (optional)

## 🔧 Step-by-Step Installation

### Phase 1: Environment Setup

#### 1. Install Node.js Dependencies

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

#### 2. Configure MongoDB

**Local MongoDB:**

```bash
# Windows - Download from https://www.mongodb.com/try/download/community
# Run mongod service

# Mac
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**MongoDB Atlas (Cloud):**

1. Visit https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Add your IP to whitelist

#### 3. Backend Configuration

Create `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/habit-tracker
JWT_SECRET=your-secret-key-min-32-chars-recommended
PORT=5000
NODE_ENV=development
```

### Phase 2: Starting the Application

#### Terminal 1 - Backend Server

```bash
cd backend
npm run dev
```

Expected output:

```
MongoDB connected
Server running on port 5000
```

#### Terminal 2 - Frontend Development Server

```bash
cd frontend
npm start
```

Expected output:

```
Compiled successfully!
Open http://localhost:3000
```

### Phase 3: First-Time Setup In App

1. **Navigate to** http://localhost:3000
2. **Sign up** with test account:

   - Username: testuser
   - Email: test@example.com
   - Password: Test@123

3. **Create first habit:**

   - Name: Morning Exercise
   - Category: Fitness
   - Frequency: Daily
   - Priority: High
   - Reminder: 6:00 AM

4. **Complete check-in:**
   - Click "+ Check In" on habit card
   - Complete your first streak!

## 📊 API Testing

### Using cURL

**Register:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Using Postman

1. Download Postman from https://www.postman.com
2. Create new Collection "Habit Tracker"
3. Set base URL: `http://localhost:5000/api`
4. Create requests:

**POST /auth/login**

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

Response includes token - add to header:

```
Authorization: Bearer <token>
```

**POST /habits**

```json
{
  "name": "Reading",
  "description": "Read 30 minutes daily",
  "category": "learning",
  "frequency": "daily",
  "priority": 3,
  "reminderTime": "20:00"
}
```

## 🗄️ Database Structure

### Collections Created Automatically

```
habit-tracker (database)
├── users
├── habits
├── checkins
├── streaks
├── challenges
└── analytics
```

### Verify MongoDB Connection

```bash
# In MongoDB shell
mongosh
use habit-tracker
show collections
db.users.find().pretty()
```

## 🛠️ Common Issues & Solutions

### Issue: "Cannot GET /"

**Cause:** Frontend not running
**Solution:** Start frontend with `npm start` in frontend directory

### Issue: CORS Error

**Cause:** Backend not running or wrong port
**Solution:**

```bash
# Verify backend running
curl http://localhost:5000/api/health

# Should return: {"status":"Server is running"}
```

### Issue: "MongooseError: Cannot connect"

**Cause:** MongoDB not running or wrong URI
**Solution:**

```bash
# Check MongoDB running
mongosh

# If error, start MongoDB:
# Windows: Run mongod from terminal
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Issue: "Port 5000 already in use"

**Cause:** Another process using the port
**Solution:**

```bash
# Find process
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

### Issue: "npm install fails"

**Solution:**

```bash
# Clear cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## 📦 Project Dependencies

### Backend (11 packages)

- express - Web framework
- mongoose - MongoDB driver
- bcryptjs - Password hashing
- jsonwebtoken - JWT auth
- node-cron - Task scheduler
- express-validator - Validation
- dotenv - Environment variables
- cors - Cross-origin support

### Frontend (8 packages)

- react - UI library
- react-dom - DOM rendering
- react-router-dom - Routing
- axios - HTTP client
- recharts - Charts
- date-fns - Date handling
- lucide-react - Icons

## 🔐 Security Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Use environment variables (not hardcoded)
- [ ] Enable HTTPS in production
- [ ] Add rate limiting
- [ ] Validate all inputs
- [ ] Use CORS whitelist in production
- [ ] Store sensitive data encrypted

## 📈 Production Deployment

### Prepare for Production

1. **Update environment variables:**

```env
NODE_ENV=production
MONGODB_URI=<production-db-uri>
JWT_SECRET=<strong-secret>
```

2. **Build frontend:**

```bash
cd frontend
npm run build
```

3. **Serve from backend:**

```bash
# Copy frontend build to backend
cp -r frontend/build backend/public
```

4. **Update backend to serve static:**

```javascript
app.use(express.static(path.join(__dirname, "public")));
```

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create habit-tracker-app

# Set environment variables
heroku config:set MONGODB_URI=<your-mongodb-uri>
heroku config:set JWT_SECRET=<strong-secret>

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Deploy to Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Railway/Render (Backend)

1. Connect GitHub repository
2. Set environment variables
3. Deploy with one click

## 📊 Monitoring

### Check Server Health

```bash
# Backend health check
curl http://localhost:5000/api/health

# Database connection
# In MongoDB shell
db.adminCommand('ping')
```

### View Logs

```bash
# Backend logs
npm run dev  # Shows all console logs

# Frontend logs
# Open browser console (F12)
```

## 🔄 Development Workflow

### Git Setup

```bash
# Initialize git
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Full MERN habit tracker"

# Add remote
git remote add origin <repo-url>

# Push
git push -u origin main
```

### File Structure Best Practices

```
project/
├── backend/
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth, validation
│   ├── server.js        # Entry point
│   └── .env            # Configuration
├── frontend/
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable components
│   │   ├── styles/     # CSS files
│   │   └── App.js      # Root component
│   └── public/         # Static assets
└── README.md
```

## 🚀 Performance Optimization

### Backend

```javascript
// Add caching
app.use(cache("5 minutes"));

// Add compression
app.use(compression());

// Add rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
```

### Frontend

```javascript
// Lazy load routes
const Dashboard = React.lazy(() => import("./pages/Dashboard"));

// Use suspense
<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>;
```

## 📚 Additional Resources

- MongoDB Docs: https://docs.mongodb.com
- Express Docs: https://expressjs.com
- React Docs: https://react.dev
- JWT Docs: https://jwt.io
- Recharts Docs: https://recharts.org

## ✅ Final Checklist

- [ ] Dependencies installed
- [ ] MongoDB running
- [ ] Backend configured (.env)
- [ ] Backend running (npm run dev)
- [ ] Frontend running (npm start)
- [ ] Can access http://localhost:3000
- [ ] Can sign up/login
- [ ] Can create habits
- [ ] Can check in
- [ ] Can view analytics

## 🎉 You're All Set!

Your complete MERN habit tracking application is ready to use.

**Next steps:**

1. Create your first habit
2. Build a 7-day streak
3. Invite friends to challenges
4. Deploy to production
5. Share your progress

Happy tracking! 🎯
