const mongoose = require('mongoose');

const bugReportSchema = new mongoose.Schema({
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
    enum: ['UI/UX Issue', 'Functionality Error', 'Performance Issue', 'Data Issue', 'Security Issue', 'Other'],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  stepsToReproduce: {
    type: String,
    required: true
  },
  expectedBehavior: String,
  actualBehavior: String,
  browser: String,
  device: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'investigating', 'in-progress', 'fixed', 'closed'],
    default: 'pending'
  },
  attachments: [{
    filename: String,
    url: String
  }],
  response: {
    message: String,
    respondedBy: String,
    respondedAt: Date
  }
}, { timestamps: true });

bugReportSchema.pre('save', async function(next) {
  if (this.isNew && !this.ticketNumber) {
    try {
      const Counter = require('./Counter');
      const counterDoc = await Counter.findOneAndUpdate(
        { _id: 'bugreport' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      const seq = counterDoc.seq;
      this.ticketNumber = `BUG-${String(seq).padStart(6, '0')}`;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model('BugReport', bugReportSchema);
