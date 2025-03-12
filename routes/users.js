const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Admin-only route
router.get('/', auth.auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin creates new user
router.post('/', auth.auth, async (req, res) => {
    try {
      // Verify admin role
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }
  
      const { username, password, role } = req.body;
      
      // Check if user exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
  
      // Create new user
      const user = new User({
        username,
        password,
        role
      });
  
      await user.save();
      
      res.status(201).json({
        message: 'User created successfully',
        user: { _id: user._id, username: user.username, role: user.role }
      });
  
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Update Role
  router.patch('/:id/role', 
    auth.auth, 
    async (req, res) => {
      try {
        const { role } = req.body;
        
        if (!['admin', 'user'].includes(role)) {
          return res.status(400).json({ error: 'Invalid role' });
        }
  
        const user = await User.findByIdAndUpdate(
          req.params.id,
          { role },
          { new: true, runValidators: true }
        ).select('-password');
  
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        res.json(user);
      } catch (error) {
        res.status(400).json({ error: error.message });
      } 
    }
  );


// Update Username
router.patch('/:id/username', 
  auth.auth, 
  async (req, res) => {
    try {
      const { username } = req.body;
      
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { username },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    } 
  }
);

// Delete user
router.delete('/:id', 
  auth.auth, 
  async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;