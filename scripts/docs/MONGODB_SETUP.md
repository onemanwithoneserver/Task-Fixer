# MongoDB Setup Guide

## Overview

The Task Fixer app now supports **MongoDB integration** for persistent, cloud-ready data storage. The app works in two modes:

1. **LocalStorage Mode** (Default) - Data stored in browser, no backend needed
2. **MongoDB Mode** - Data stored in MongoDB database, synced across devices

## Do You Need MongoDB?

**You DON'T need MongoDB if:**
- You're using the app on a single device/browser
- You're okay with losing data if you clear browser cache
- You want a simple setup with no backend

**You SHOULD use MongoDB if:**
- You want data to persist across multiple devices
- You want to access your data from different browsers
- You want automatic backups
- You're deploying for multiple users

## Quick Setup (5 minutes)

### Option 1: Local MongoDB (Development)

1. **Install MongoDB:**
   ```powershell
   # Download from: https://www.mongodb.com/try/download/community
   # Or Windows users can use Chocolatey:
   choco install mongodb
   ```

2. **Start MongoDB:**
   ```powershell
   mongod
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

4. **Start Backend Server:**
   ```bash
   npm run dev
   ```
   Server runs at: `http://localhost:5000`

5. **Start Frontend (in separate terminal):**
   ```bash
   cd Main
   npm run dev
   ```

6. **Done!** The app will automatically detect and connect to MongoDB.

### Option 2: MongoDB Atlas (Cloud - Free)

1. **Create Free Account:** https://www.mongodb.com/cloud/atlas/register

2. **Create Cluster:**
   - Click "Build a Database"
   - Choose "FREE" tier
   - Select region closest to you
   - Click "Create Cluster"

3. **Create Database User:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Set username & password (save these!)

4. **Allow Network Access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)

5. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string

6. **Configure Backend:**
   ```bash
   cd backend
   # Edit .env file:
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/task-fixer
   ```

7. **Start Backend:**
   ```bash
   npm install
   npm run dev
   ```

8. **Start Frontend:**
   ```bash
   cd Main
   npm run dev
   ```

## Using the App

### With MongoDB Connected:
- **Green badge** shows "MongoDB Connected"
- All data automatically saved to database
- Data syncs across devices
- Edit, delete, search all work through database

### Without MongoDB (Offline Mode):
- **Gray badge** shows "Using Local Storage"
- Data saved in browser only
- **Sync button** appears to upload data to MongoDB later
- Click "⬆ Sync to MongoDB" when backend becomes available

## Syncing LocalStorage to MongoDB

If you already have words in localStorage and want to move to MongoDB:

1. Start the backend server
2. Refresh the app
3. Click the **"⬆ Sync to MongoDB"** button
4. Your data will be uploaded to MongoDB
5. Status changes to "MongoDB Connected"

## Testing

### Test Backend Connection:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "success": true,
  "message": "Task Fixer API is running",
  "database": "connected"
}
```

### Test Adding Word via API:
```bash
curl -X POST http://localhost:5000/api/vocabulary \
  -H "Content-Type: application/json" \
  -d '{"word":"eloquent","meaning":"fluent in speaking","example":"An eloquent speech"}'
```

## Project Structure

```
Task-Fixer/
├── Main/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   └── Communication.jsx  # Vocabulary UI
│   │   └── services/
│   │       └── vocabularyService.js  # API client
│   ├── .env                       # API URL config
│   └── package.json
│
└── backend/                       # Backend (Express + MongoDB)
    ├── models/
    │   └── Vocabulary.js          # MongoDB schema
    ├── routes/
    │   └── vocabulary.js          # API endpoints
    ├── server.js                  # Main server
    ├── .env                       # MongoDB connection
    └── package.json
```

## API Endpoints

All endpoints at `http://localhost:5000/api/vocabulary`:

- `GET /` - Get all words (supports ?search=query)
- `GET /:id` - Get single word
- `POST /` - Add new word
- `PUT /:id` - Update word
- `DELETE /:id` - Delete word
- `POST /bulk` - Bulk import (for syncing)

## Troubleshooting

### "MongoDB Connection Error"
- Check if MongoDB is running: `mongod --version`
- Verify connection string in `backend/.env`
- Check if port 27017 is open

### "Backend not available"
- Check if backend server is running: `cd backend && npm run dev`
- Verify port 5000 is not in use
- Check `Main/.env` has correct API URL

### "Sync Failed"
- Ensure backend is running
- Check browser console for errors
- Try refreshing the page

### Using Different Port
Backend (backend/.env):
```
PORT=3001
```

Frontend (Main/.env):
```
VITE_API_URL=http://localhost:3001/api
```

## Production Deployment

### Backend (Heroku/Railway/Render):
1. Set environment variable: `MONGODB_URI` to Atlas connection string
2. Deploy `backend/` folder
3. Note the deployed URL

### Frontend (Vercel/Netlify):
1. Set environment variable: `VITE_API_URL` to backend URL
2. Deploy `Main/` folder

## Benefits of Using MongoDB

✅ **Data Persistence** - Never lose your vocabulary
✅ **Multi-Device Sync** - Access from phone, laptop, tablet
✅ **Search Performance** - Fast full-text search
✅ **Backup** - Automatic database backups
✅ **Scalability** - Ready for multiple users
✅ **Analytics** - Track learning progress over time

## Still Have Questions?

- Check `backend/README.md` for detailed API docs
- MongoDB docs: https://docs.mongodb.com/
- MongoDB Atlas docs: https://docs.atlas.mongodb.com/
