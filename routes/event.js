const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Create new event (Admin only)
router.post('/', auth.auth, async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      createdBy: req.user._id
    });
    
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all events (Admin view)
router.get('/', auth.auth, async (req, res) => {
  const events = await Event.find().populate('createdBy', 'username');
  res.json(events);
});

// Update event status
router.patch('/:id/status', auth.auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/active', async (req, res) => {
  try {
    const activeEvents = await Event.find({ 
      status: 'active',
      closesAt: { $gt: new Date() }
    }).select('-createdBy');
    
    res.json(activeEvents);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;