# 🗑️ Remove Old MongoDB Database

If you're seeing data from your old project "Bharat Shurka" or any other old database, follow these steps to clean up and start fresh:

## Quick Fix (Recommended)

### Option 1: Use Cleanup Script (Easiest)
```powershell
# Run this from the project root
.\scripts\cleanup-old-db.ps1
```

This interactive tool will:
1. List all your MongoDB databases
2. Let you choose which one to delete
3. Safely delete the old database
4. Task Fixer will automatically use a fresh database

### Option 2: Manual Cleanup via npm
```bash
cd backend
npm install
npm run cleanup
```

## Alternative: Use a New Database Name

If you want to keep your old database and just use a different one:

1. Edit `backend/.env`:
   ```env
   # Change the database name to anything you want
   MONGODB_URI=mongodb://localhost:27017/my-new-task-fixer
   ```

2. Restart the backend:
   ```bash
   cd backend
   npm run dev
   ```

## Using MongoDB Compass (GUI Method)

1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Connect to: `mongodb://localhost:27017`
3. Find your old database (e.g., "bharat-shurka" or "Bharat Shurka")
4. Click the trash icon next to the database name
5. Confirm deletion

## Manual Command Line Method

If you prefer using the MongoDB shell:

```bash
# Open MongoDB shell
mongosh

# List all databases
show dbs

# Switch to the old database (replace with your actual database name)
use bharat-shurka

# Delete it
db.dropDatabase()

# Verify it's gone
show dbs

# Exit
exit
```

## What's Changed in Task Fixer

Your Task Fixer backend now uses a **new database name**: `task-fixer-v2`

This means:
- ✅ No conflict with old projects
- ✅ Fresh start with clean data
- ✅ Your old databases remain untouched (unless you delete them)

## Verify It's Working

After cleanup:

1. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```

2. You should see:
   ```
   ✅ MongoDB Connected Successfully
   📊 Database: task-fixer-v2
   ```

3. Start the frontend:
   ```bash
   cd Main
   npm run dev
   ```

4. Look for the **green "MongoDB Connected" badge** in the Vocabulary section

## Still Seeing Old Data?

Clear your browser's localStorage:

```javascript
// Open browser console (F12) and run:
localStorage.clear()
// Then refresh the page
```

## Need Help?

- Check if MongoDB is running: `mongod --version`
- Check databases: `mongosh` → `show dbs`
- Check backend logs for connection errors
- Verify `backend/.env` has the correct database name

## Database Names Explained

The MongoDB URI has this format:
```
mongodb://localhost:27017/DATABASE_NAME
                          ^^^^^^^^^^^^^^
                          This is what you can change!
```

Examples:
- `mongodb://localhost:27017/task-fixer` - Default
- `mongodb://localhost:27017/task-fixer-v2` - New (current)
- `mongodb://localhost:27017/my-productivity` - Custom name
- `mongodb://localhost:27017/bharat-shurka` - Your old project (delete this)
