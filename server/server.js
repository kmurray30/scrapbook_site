require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { seedDatabase } = require('./db/seedData');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Device-Id']
}));
app.use(express.json());

// Import routes
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const followsRouter = require('./routes/follows');

// API routes
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/follows', followsRouter);

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  // Seed sample data after server starts
  await seedDatabase();
});

