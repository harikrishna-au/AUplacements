const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'urgent'],
    default: 'info'
  },
  priority: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date
  },
  createdBy: {
    type: String,
    default: 'Admin'
  }
}, {
  timestamps: true
});

// Index for fetching active notices
noticeSchema.index({ isActive: 1, createdAt: -1 });
noticeSchema.index({ isActive: 1, priority: -1, createdAt: -1 }); // For sorted notices
noticeSchema.index({ isActive: 1, expiresAt: 1 }); // For expiry filtering

module.exports = mongoose.model('Notice', noticeSchema);
