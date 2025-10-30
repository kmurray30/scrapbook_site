const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../db/database');
const { authenticateDevice } = require('../middleware/auth');

// Get users that current user is following
router.get('/following', authenticateDevice, async (req, res) => {
  try {
    const following = await dbAll(`
      SELECT u.id, u.displayName, u.profilePic, f.createdAt as followedAt
      FROM follows f
      JOIN users u ON f.followedId = u.id
      WHERE f.followerId = ?
      ORDER BY f.createdAt DESC
    `, [req.user.id]);

    res.json(following);
  } catch (error) {
    console.error('Error fetching following:', error);
    res.status(500).json({ error: 'Failed to fetch following' });
  }
});

// Check if current user follows a specific user
router.get('/status/:userId', authenticateDevice, async (req, res) => {
  try {
    const follow = await dbGet(`
      SELECT * FROM follows 
      WHERE followerId = ? AND followedId = ?
    `, [req.user.id, req.params.userId]);

    res.json({ isFollowing: !!follow });
  } catch (error) {
    console.error('Error checking follow status:', error);
    res.status(500).json({ error: 'Failed to check follow status' });
  }
});

// Follow a user
router.post('/', authenticateDevice, async (req, res) => {
  try {
    const { followedId } = req.body;

    if (!followedId) {
      return res.status(400).json({ error: 'User ID to follow required' });
    }

    if (followedId === req.user.id) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    await dbRun('INSERT INTO follows (followerId, followedId) VALUES (?, ?)', [req.user.id, followedId]);
    res.json({ success: true, message: 'User followed' });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Already following this user' });
    }
    console.error('Error following user:', error);
    res.status(500).json({ error: 'Failed to follow user' });
  }
});

// Unfollow a user
router.delete('/:userId', authenticateDevice, async (req, res) => {
  try {
    await dbRun('DELETE FROM follows WHERE followerId = ? AND followedId = ?', [req.user.id, req.params.userId]);
    res.json({ success: true, message: 'User unfollowed' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
});

module.exports = router;

