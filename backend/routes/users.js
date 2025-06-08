const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users/me - Get current user info (static for simplicity)
router.get('/me', async (req, res) => {
  try {
    // For simplicity, return static user data
    // In a real app, you'd get this from authentication middleware
    const userData = {
      username: 'testuser',
      avatar: null
    };

    res.json(userData);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

module.exports = router;