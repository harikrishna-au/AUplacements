const mongoose = require('mongoose');

const { SUPPORT_TICKET_TYPE, SUPPORT_TICKET_PRIORITY, SUPPORT_TICKET_STATUS } = require('../utils/constants');

const supportTicketSchema = new mongoose.Schema({
  studentId: {
    type: String,
    ref: 'Student',
    required: true
  },
  ticketNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  type: {
    type: String,
    enum: Object.values(SUPPORT_TICKET_TYPE),
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: Object.values(SUPPORT_TICKET_PRIORITY),
    default: SUPPORT_TICKET_PRIORITY.MEDIUM
  },
  status: {
    type: String,
    enum: Object.values(SUPPORT_TICKET_STATUS),
    default: SUPPORT_TICKET_STATUS.PENDING
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  response: {
    message: String,
    respondedBy: String,
    respondedAt: Date
  },
  attachments: [{
    filename: String,
    url: String,
    size: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate ticket number automatically before validation
supportTicketSchema.pre('validate', async function(next) {
  if (!this.ticketNumber) {
    try {
      const Counter = require('./Counter');
      const seq = await Counter.getNextSequence('ticketNumber');
      this.ticketNumber = `TICKET-${String(seq).padStart(6, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

supportTicketSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for better query performance
supportTicketSchema.index({ studentId: 1, createdAt: -1 }); // For listing student tickets
supportTicketSchema.index({ studentId: 1, type: 1 }); // For filtering by type
supportTicketSchema.index({ studentId: 1, status: 1 }); // For filtering by status

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
