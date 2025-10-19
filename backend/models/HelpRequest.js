const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema({
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
  category: {
    type: String,
    enum: ['Account Issue', 'Application Help', 'Technical Support', 'General Question', 'Other'],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'answered', 'closed'],
    default: 'pending'
  },
  response: {
    message: String,
    respondedBy: String,
    respondedAt: Date
  },
  attachments: [{
    filename: String,
    url: String
  }]
}, { timestamps: true });

helpRequestSchema.pre('save', async function(next) {
  if (this.isNew && !this.ticketNumber) {
    try {
      const Counter = require('./Counter');
      const counterDoc = await Counter.findOneAndUpdate(
        { _id: 'helpRequest' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      const seq = counterDoc.seq;
      this.ticketNumber = `HELP-${String(seq).padStart(6, '0')}`;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model('HelpRequest', helpRequestSchema);
