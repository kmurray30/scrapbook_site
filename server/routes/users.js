const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../db/database');
const { v4: uuidv4 } = require('uuid');

// Initialize a new user with device ID
router.post('/init', async (req, res) => {
  try {
    const { displayName, deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({ error: 'Device ID required' });
    }

    // Check if device ID already exists
    const existing = await dbGet('SELECT * FROM users WHERE deviceId = ?', [deviceId]);
    if (existing) {
      console.log('Found existing user with deviceId:', deviceId, '- User:', existing.displayName);
      return res.json(existing);
    }

    // If no user found with this deviceId, check if there's a sample user without a deviceId
    // and auto-assign this deviceId to them (auto-claim a sample user)
    const unclaimedUser = await dbGet('SELECT * FROM users WHERE deviceId IS NULL OR deviceId = "" ORDER BY id LIMIT 1');
    
    if (unclaimedUser) {
      console.log('Auto-assigning deviceId to sample user:', unclaimedUser.displayName);
      await dbRun('UPDATE users SET deviceId = ? WHERE id = ?', [deviceId, unclaimedUser.id]);
      const claimedUser = await dbGet('SELECT * FROM users WHERE id = ?', [unclaimedUser.id]);
      return res.json(claimedUser);
    }

    // If all sample users are claimed and displayName provided, create new user
    if (displayName) {
      console.log('Creating new user:', displayName);
      const result = await dbRun('INSERT INTO users (displayName, deviceId) VALUES (?, ?)', [displayName, deviceId]);
      const newUser = await dbGet('SELECT * FROM users WHERE id = ?', [result.lastID]);
      return res.json(newUser);
    }

    // No unclaimed users and no displayName provided
    return res.status(400).json({ error: 'No available users. Please provide a display name.' });
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

// Update user's theme color
router.post('/theme', async (req, res) => {
  try {
    const { deviceId, themeColor } = req.body;

    console.log('Theme update request - deviceId:', deviceId, 'themeColor:', themeColor);

    if (!deviceId || !themeColor) {
      return res.status(400).json({ error: 'Device ID and theme color required' });
    }

    const validColors = ['purple', 'green', 'pink', 'blue', 'yellow', 'orange', 'red'];
    if (!validColors.includes(themeColor)) {
      return res.status(400).json({ error: 'Invalid theme color' });
    }

    // Check if user exists first
    const existingUser = await dbGet('SELECT * FROM users WHERE deviceId = ?', [deviceId]);
    console.log('Found user:', existingUser ? `Yes (id: ${existingUser.id})` : 'No');
    
    if (!existingUser) {
      console.error('User not found for deviceId:', deviceId);
      return res.status(404).json({ error: 'User not found. Please refresh and try again.' });
    }

    await dbRun('UPDATE users SET themeColor = ? WHERE deviceId = ?', [themeColor, deviceId]);
    const user = await dbGet('SELECT * FROM users WHERE deviceId = ?', [deviceId]);
    
    res.json(user);
  } catch (error) {
    console.error('Error updating theme:', error);
    res.status(500).json({ error: 'Failed to update theme' });
  }
});

module.exports = router;

