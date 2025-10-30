const { dbGet } = require('../db/database');

// Middleware to validate device ID and attach user to request
async function authenticateDevice(req, res, next) {
  const deviceId = req.headers['x-device-id'];
  
  if (!deviceId) {
    return res.status(401).json({ error: 'Device ID required' });
  }

  try {
    const user = await dbGet('SELECT * FROM users WHERE deviceId = ?', [deviceId]);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

module.exports = { authenticateDevice };

