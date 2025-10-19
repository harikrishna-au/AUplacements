const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  category: {
    type: String,
    enum: ['Content Quality', 'User Experience', 'Features', 'Performance', 'Other'],
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
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'implemented', 'closed'],
    default: 'pending'
  },
  response: {
    message: String,
    respondedBy: String,
    respondedAt: Date
  }
}, { timestamps: true });

feedbackSchema.pre('save', async function(next) {
  if (this.isNew && !this.ticketNumber) {
    try {
      const Counter = require('./Counter');
      const counterDoc = await Counter.findOneAndUpdate(
        { _id: 'feedback' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.ticketNumber = `FB-${String(counterDoc.seq).padStart(6, '0')}`;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model('Feedback', feedbackSchema);
