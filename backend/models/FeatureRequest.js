const mongoose = require('mongoose');

const featureRequestSchema = new mongoose.Schema({
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
    enum: ['New Feature', 'Enhancement', 'Integration', 'UI Improvement', 'Other'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  useCase: {
    type: String,
    required: true
  },
  expectedBenefit: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'under-review', 'planned', 'in-development', 'completed', 'rejected'],
    default: 'pending'
  },
  votes: {
    type: Number,
    default: 0,
    min: 0
  },
  response: {
    message: String,
    respondedBy: String,
    respondedAt: Date
  }
}, { timestamps: true });

featureRequestSchema.pre('save', async function(next) {
  if (this.isNew && !this.ticketNumber) {
    try {
      const Counter = require('./Counter');
      const counterDoc = await Counter.findOneAndUpdate(
        { _id: 'featureRequest' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      const seq = counterDoc.seq;
      this.ticketNumber = `FR-${String(seq).padStart(6, '0')}`;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model('FeatureRequest', featureRequestSchema);
