const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  isAnonymous: { type: Boolean, default: true },
  allowCustomOptions: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  options: [String], // Predefined options + user-added options
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  closesAt: Date
});

module.exports = mongoose.model('Event', eventSchema);