const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Submit vote
router.post('/', auth.auth, async (req, res) => {
  try {
    const event = await Event.findById(req.body.eventId);
    
    // Validate event
    if (!event || event.status !== 'active') {
      return res.status(400).json({ error: 'Event not available for voting' });
    }

    // Is User Already Vote?
    const alreadyVote = await Vote.findOne({ event: req.body.eventId, voter: req.user._id });

    if (alreadyVote) {
      return res.status(400).json({ error: 'You already vote this event!' });
    }

    // Validate option
    if (!event.options.includes(req.body.option)) {
      if (!event.allowCustomOptions) {
        return res.status(400).json({ error: 'Custom options not allowed' });
      }
      // Add new option to event
      event.options.push(req.body.option);
      await event.save();
    }

    // Create vote
    const vote = new Vote({
      event: event._id,
      option: req.body.option,
      voter: req.user._id
    });


    await vote.save();
    res.status(201).json(vote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get results (Different responses based on role and anonymity)
router.get('/results/:eventId', auth.auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    const votes = await Vote.aggregate([
      { $match: { event: event._id } },
      { $group: { _id: "$option", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // For non-admin users or anonymous events
    const publicResult = votes.map(v => ({ option: v._id, count: v.count }));

    // Admin view for non-anonymous events
    if (req.user.role === 'admin' && !event.isAnonymous) {
      const detailedVotes = await Vote.find({ event: event._id })
        .populate('voter', 'username');
      return res.json({
        summary: publicResult,
        details: detailedVotes.map(v => ({
          option: v.option,
          voter: v.voter ? v.voter.username : 'Deleted User',
          timestamp: v.createdAt
        }))
      });
    }

    res.json(publicResult);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;