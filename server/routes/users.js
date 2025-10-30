const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../db/database');
const { v4: uuidv4 } = require('uuid');

// Initialize a new user with device ID
router.post('/init', async (req, res) => {
  try {
    const { displayName, deviceId } = req.body;

    if (!displayName || !deviceId) {
      return res.status(400).json({ error: 'Display name and device ID required' });
    }

    // Check if device ID already exists
    const existing = await dbGet('SELECT * FROM users WHERE deviceId = ?', [deviceId]);
    if (existing) {
      return res.json(existing);
    }

    // Create new user
    const result = await dbRun('INSERT INTO users (displayName, deviceId) VALUES (?, ?)', [displayName, deviceId]);
    const newUser = await dbGet('SELECT * FROM users WHERE id = ?', [result.lastID]);
    res.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await dbGet('SELECT id, displayName, profilePic, createdAt FROM users WHERE id = ?', [req.params.id]);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get all users (for friends gallery)
router.get('/', async (req, res) => {
  try {
    const users = await dbAll('SELECT id, displayName, profilePic, createdAt FROM users ORDER BY createdAt DESC', []);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Upgrade account with Google OAuth (placeholder)
router.post('/upgrade-google', async (req, res) => {
  try {
    const { deviceId, googleId, profilePic } = req.body;

    if (!deviceId || !googleId) {
      return res.status(400).json({ error: 'Device ID and Google ID required' });
    }

    await dbRun('UPDATE users SET googleId = ?, profilePic = ? WHERE deviceId = ?', [googleId, profilePic, deviceId]);
    const user = await dbGet('SELECT * FROM users WHERE deviceId = ?', [deviceId]);
    res.json(user);
  } catch (error) {
    console.error('Error upgrading account:', error);
    res.status(500).json({ error: 'Failed to upgrade account' });
  }
});

module.exports = router;

