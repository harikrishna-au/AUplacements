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
    required: true,
    unique: true
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

// Generate ticket number automatically
supportTicketSchema.pre('save', async function(next) {
  if (!this.ticketNumber) {
    const count = await mongoose.model('SupportTicket').countDocuments();
    this.ticketNumber = `TICKET-${String(count + 1).padStart(6, '0')}`;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
