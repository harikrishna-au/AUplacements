const mongoose = require('mongoose');

const { APPLICATION_STATUS, STAGE_STATUS } = require('../utils/constants');

const studentApplicationSchema = new mongoose.Schema({
  studentId: {
    type: String,
    ref: 'Student',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  
  // Application status
  status: {
    type: String,
    enum: Object.values(APPLICATION_STATUS),
    default: APPLICATION_STATUS.APPLIED
  },
  
  // Current stage in recruitment process
  currentStage: {
    type: Number,
    default: 1
  },
  
  // Stage history with results
  stageHistory: [{
    stageNumber: Number,
    stageName: String,
    status: {
      type: String,
      enum: Object.values(STAGE_STATUS)
    },
    completedDate: Date,
    score: String,
    feedback: String
  }],
  
  // Application details
  appliedDate: {
    type: Date,
    default: Date.now
  },
  
  // Final outcome
  outcome: {
    selected: Boolean,
    package: String,
    role: String,
    joiningDate: Date
  },
  
  // Notes and updates
  notes: String,
  lastUpdated: Date

}, { timestamps: true });

// Compound index to ensure one application per student per company
studentApplicationSchema.index({ studentId: 1, companyId: 1 }, { unique: true });

module.exports = mongoose.model('StudentApplication', studentApplicationSchema);
