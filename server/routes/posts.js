const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../db/database');
const { authenticateDevice } = require('../middleware/auth');

// Get all posts (or posts by specific user)
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    
    let posts;
    if (userId) {
      posts = await dbAll(`
        SELECT p.*, u.displayName, u.profilePic 
        FROM posts p 
        JOIN users u ON p.userId = u.id 
        WHERE p.userId = ? 
        ORDER BY p.createdAt DESC
      `, [userId]);
    } else {
      posts = await dbAll(`
        SELECT p.*, u.displayName, u.profilePic 
        FROM posts p 
        JOIN users u ON p.userId = u.id 
        ORDER BY p.createdAt DESC
      `, []);
    }

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Create a new post
router.post('/', authenticateDevice, async (req, res) => {
  try {
    const { title, content, category, location } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Title, content, and category required' });
    }

    // Validate word count (approximately 20 words = ~150 characters)
    const wordCount = content.trim().split(/\s+/).length;
    if (wordCount > 20) {
      return res.status(400).json({ error: 'Content must be 20 words or less' });
    }

    const result = await dbRun(`
      INSERT INTO posts (userId, title, content, category, location) 
      VALUES (?, ?, ?, ?, ?)
    `, [req.user.id, title, content, category, location || null]);

    const newPost = await dbGet(`
      SELECT p.*, u.displayName, u.profilePic 
      FROM posts p 
      JOIN users u ON p.userId = u.id 
      WHERE p.id = ?
    `, [result.lastID]);

    res.json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get posts for a specific user with their info
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await dbAll(`
      SELECT p.*, u.displayName, u.profilePic 
      FROM posts p 
      JOIN users u ON p.userId = u.id 
      WHERE p.userId = ? 
      ORDER BY p.createdAt DESC
    `, [req.params.userId]);

    res.json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
});

module.exports = router;

