# Task Fixer Backend API

Backend API for the Task Fixer application with MongoDB integration.

## Setup Instructions

### 1. Install MongoDB

**Windows:**
```powershell
# Download from https://www.mongodb.com/try/download/community
# Or use Chocolatey:
choco install mongodb
```

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb
```

### 2. Start MongoDB

```powershell
# Windows
mongod

# Mac/Linux
brew services start mongodb-community
# or
sudo systemctl start mongod
```

### 3. Install Dependencies

```bash
cd backend
npm install
```

### 4. Configure Environment

Copy `.env.example` to `.env` and update if needed:
```bash
cp .env.example .env
```

Default configuration:
- MongoDB: `mongodb://localhost:27017/task-fixer`
- Port: `5000`

**For MongoDB Atlas (Cloud):**
Replace `MONGODB_URI` in `.env` with your Atlas connection string:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/task-fixer
```

### 5. Run the Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will start at: `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```

### Vocabulary Endpoints

#### Get all entries
```
GET /api/vocabulary
Query params: ?search=word&userId=user-id
```

#### Get single entry
```
GET /api/vocabulary/:id
```

#### Create entry
```
POST /api/vocabulary
Body: {
  "word": "eloquent",
  "meaning": "fluent or persuasive in speaking",
  "example": "She gave an eloquent speech",
  "userId": "optional-user-id"
}
```

#### Update entry
```
PUT /api/vocabulary/:id
Body: {
  "word": "updated word",
  "meaning": "updated meaning",
  "example": "updated example"
}
```

#### Delete entry
```
DELETE /api/vocabulary/:id
```

#### Bulk import (migrate from localStorage)
```
POST /api/vocabulary/bulk
Body: {
  "entries": [
    { "word": "word1", "meaning": "...", "example": "..." },
    { "word": "word2", "meaning": "...", "example": "..." }
  ],
  "userId": "optional-user-id"
}
```

## Testing the API

### Using curl:
```bash
# Health check
curl http://localhost:5000/api/health

# Get all vocabulary
curl http://localhost:5000/api/vocabulary

# Add new word
curl -X POST http://localhost:5000/api/vocabulary \
  -H "Content-Type: application/json" \
  -d '{"word":"eloquent","meaning":"fluent in speaking","example":"An eloquent speech"}'
```

### Using MongoDB Compass:
1. Download MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. View `task-fixer` database and `vocabularies` collection

## Project Structure

```
backend/
├── models/
│   └── Vocabulary.js      # MongoDB schema
├── routes/
│   └── vocabulary.js      # API routes
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env                   # Environment variables (git ignored)
└── .env.example           # Environment template
```

## Frontend Integration

The frontend Communication component will automatically:
1. Try to connect to the backend API
2. Fall back to localStorage if API is unavailable
3. Sync data between localStorage and MongoDB

## Troubleshooting

**MongoDB not starting:**
- Check if MongoDB is installed: `mongod --version`
- Check if port 27017 is available
- Check MongoDB logs

**Connection refused:**
- Ensure MongoDB is running
- Check MONGODB_URI in `.env`
- Verify firewall settings

**Port already in use:**
- Change PORT in `.env` to different number
- Kill process using port 5000: `netstat -ano | findstr :5000`
