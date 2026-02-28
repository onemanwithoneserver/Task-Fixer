import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import vocabularyRoutes from './routes/vocabulary.js';
import todoRoutes from './routes/todo.js';
import milestoneRoutes from './routes/milestone.js';
import queryRoutes from './routes/query.js';
import moneyTrackerRoutes from './routes/moneyTracker.js';
import dailyRoutes from './routes/daily.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  });

// MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB Disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB Error:', error);
});

// Routes
app.use('/api/vocabulary', vocabularyRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/money-tracker', moneyTrackerRoutes);
app.use('/api/daily', dailyRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Task Fixer API is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Task Fixer API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      vocabulary: '/api/vocabulary'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api`);
});

// Handle port already in use error
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.error(`💡 Try: npx kill-port ${PORT} or change PORT in .env`);
    process.exit(1);
  } else {
    console.error('❌ Server Error:', error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing HTTP server...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT received. Closing gracefully...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});
