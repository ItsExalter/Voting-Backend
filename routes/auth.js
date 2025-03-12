const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ 
      token,
      role: user.role,
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// router.post('/validateToken', async (req, res) => {
  
//   try {
//     const { token } = req.body;

//   if (!token) {
//     return res.status(400).json({ valid: false, error: 'Token is required' });
//   }

//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   return res.status(200).json({ valid: true, decoded });

//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });


module.exports = router;