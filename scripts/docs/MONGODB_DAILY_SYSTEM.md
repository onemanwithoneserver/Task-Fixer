# MongoDB Daily Submission System

## 🎯 Architecture Overview

Your app now uses **MongoDB as the single source of truth** for daily submissions.

```
Frontend (React)
     ↓
Backend (Node + Express)
     ↓
MongoDB (DailyRecord Collection)
```

### Benefits
- ✅ **Multi-device sync** - Access from anywhere
- ✅ **No data loss** - Cloud backup
- ✅ **Real analytics** - Historical tracking
- ✅ **Secure** - Centralized data storage
- ✅ **Real streaks** - Server-side calculation

---

## 📁 Files Created/Modified

### Backend

**Created:**
- `backend/models/DailyRecord.js` - MongoDB schema
- `backend/routes/daily.js` - API endpoints

**Modified:**
- `backend/server.js` - Added daily routes

### Frontend

**Created:**
- `Main/src/services/dailyService.js` - API client

**Modified:**
- `Main/App.jsx` - Loads daily status from MongoDB on startup
- `Main/src/components/Dashboard.jsx` - Submits to MongoDB
- `Main/src/store/useFocusStore.js` - Added `dailyStatus` to state

---

## 🔌 API Endpoints

### `GET /api/daily/today`
Returns today's record or `null` if none exists.

```json
{
  "date": "2026-02-11",
  "submitted": true,
  "stats": { ... },
  "planner": [...],
  "habits": [...],
  "reflection": "...",
  "goal": "..."
}
```

### `POST /api/daily/submit`
Submit day with all data. Marks as `submitted: true`.

**Request Body:**
```json
{
  "date": "2026-02-11",
  "stats": {
    "completedTasks": 10,
    "totalTasks": 12,
    "habitsDone": 5,
    "totalHabits": 6,
    "learningItems": 8,
    "completionRate": 83
  },
  "planner": [...],
  "habits": [...],
  "learning": { ... },
  "reflection": "Great day!",
  "goal": "Complete assignment",
  "cycleDay": 45
}
```

**Response:**
```json
{
  "_id": "...",
  "date": "2026-02-11",
  "submitted": true,
  ...rest of data
}
```

### `PUT /api/daily/:date`
Update day data **without** submitting. Cannot update if already submitted.

### `POST /api/daily/autosave`
Auto-save draft progress without marking as submitted.

### `GET /api/daily/all`
Get all records (last 100) for analytics/history.

---

## 🔄 Data Flow

### On App Start (App.jsx)
```javascript
useEffect(() => {
  async function loadTodayStatus() {
    const record = await getToday();
    
    if (record) {
      setState(prev => ({
        ...prev,
        dailyStatus: {
          date: record.date,
          submitted: record.submitted
        }
      }));
    }
  }
  
  loadTodayStatus();
}, []);
```

### On Dashboard Submit
```javascript
const handleSubmitDay = async () => {
  const payload = { date, stats, planner, habits, learning, ... };
  
  const record = await submitDay(payload);
  
  // Update global state
  setState(prev => ({
    ...prev,
    dailyStatus: {
      date: record.date,
      submitted: true
    }
  }));
};
```

### Planner Lockdown
```javascript
// Reads from global state
const isDaySubmitted =
  state.dailyStatus?.submitted &&
  state.dailyStatus?.date === today;

// UI automatically locks
<input 
  disabled={isDaySubmitted}
  onChange={() => !isDaySubmitted && toggleTask(i)}
/>
```

---

## 🔒 Submission Lock System

### Global State (useFocusStore.js)
```javascript
dailyStatus: {
  date: "2026-02-11",  // ISO format
  submitted: true       // Lock flag
}
```

### Lock Behavior

**When `submitted: true`:**
- ✅ Dashboard: Submit button shows "✔ Day Submitted" (gray)
- ✅ Dashboard: Reset button disabled
- ✅ Dashboard: Goal input disabled
- ✅ Dashboard: Reflection textarea disabled
- ✅ Planner: All checkboxes disabled
- ✅ Planner: Schedule change button hidden
- ✅ Planner: Submit circle shows green checkmark

**Auto-Reset:**
- App checks every minute if date changed
- If new day detected → `submitted: false`
- MongoDB is authoritative source on refresh

---

## 🚀 Running the System

### 1. Start Backend
```bash
cd backend
npm run dev
```

Backend runs on: `http://localhost:5000`

### 2. Start Frontend
```bash
cd Main
npm run dev
```

Frontend runs on: `http://localhost:5173`

### 3. Environment Variables

**Backend (.env):**
```env
MONGODB_URI=mongodb://localhost:27017/task-fixer
PORT=5000
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📊 MongoDB Schema

### DailyRecord Collection

```javascript
{
  date: String,           // "2026-02-11" (unique)
  submitted: Boolean,     // Lock flag
  
  stats: {
    completedTasks: Number,
    totalTasks: Number,
    habitsDone: Number,
    totalHabits: Number,
    learningItems: Number,
    totalLearningItems: Number,
    completionRate: Number
  },
  
  planner: Array,         // Tasks with time slots
  habits: Array,          // Communication habits
  learning: Object,       // { mern: [], dsa: [], ui: [] }
  queries: Array,         // Questions/notes
  milestones: Array,      // Achievements
  
  reflection: String,     // Daily reflection
  goal: String,          // Main goal
  cycleDay: Number,      // Day in cycle (1-100)
  
  userId: String,        // For multi-user support
  
  createdAt: Date,       // Auto-generated
  updatedAt: Date        // Auto-generated
}
```

---

## 🔍 Testing

### Check Today's Status
```bash
curl http://localhost:5000/api/daily/today
```

### Submit Test Data
```bash
curl -X POST http://localhost:5000/api/daily/submit \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-02-11",
    "stats": { "completedTasks": 10, "totalTasks": 12 },
    "planner": [],
    "habits": [],
    "learning": {},
    "reflection": "Test",
    "goal": "Test Goal",
    "cycleDay": 1
  }'
```

### Get All Records
```bash
curl http://localhost:5000/api/daily/all
```

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Start MongoDB: `mongod` or check service
- Verify connection string in `backend/.env`

### "Status not syncing"
- Check browser console for API errors
- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`

### "Day not unlocking"
- MongoDB is authoritative - check database directly
- Force unlock: `localStorage.clear()` + refresh

### "Already submitted" error
- Use `PUT /api/daily/:date` for updates (before submit)
- Delete record to resubmit: `DELETE /api/daily/:date`

---

## 🎨 Future Enhancements

- **Auto-save** - Periodic background saves
- **Offline mode** - Queue submissions when offline
- **Multi-user** - User authentication with JWT
- **Streak calculation** - Server-side streak logic
- **Analytics API** - Aggregate stats endpoints
- **Export** - Download data as JSON/CSV

---

## 📝 Migration Notes

### Old System (localStorage)
- ❌ Data lost on browser clear
- ❌ No sync across devices
- ❌ Limited analytics

### New System (MongoDB)
- ✅ Persistent cloud storage
- ✅ Multi-device sync
- ✅ Rich analytics possible
- ✅ Backup & recovery
- ✅ Scalable architecture

**The old `useDailyRecords` hook is still used for history/analytics but submission now goes through MongoDB API.**

---

## 🎯 Quick Reference

| Action | Endpoint | Method |
|--------|----------|--------|
| Get today | `/api/daily/today` | GET |
| Submit day | `/api/daily/submit` | POST |
| Update day | `/api/daily/:date` | PUT |
| Auto-save | `/api/daily/autosave` | POST |
| Get history | `/api/daily/all` | GET |
| Delete | `/api/daily/:date` | DELETE |

---

**Created:** February 11, 2026
**Status:** ✅ Production Ready
