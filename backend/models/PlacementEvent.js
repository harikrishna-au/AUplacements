const mongoose = require('mongoose');

const { EVENT_TYPE, EVENT_STATUS } = require('../utils/constants');

const placementEventSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  description: String,
  
  eventType: {
    type: String,
    enum: Object.values(EVENT_TYPE),
    required: true
  },
  
  // Date and time
  startDate: {
    type: Date,
    required: true
  },
  
  endDate: {
    type: Date,
    required: true
  },
  
  allDay: {
    type: Boolean,
    default: false
  },
  
  // Location
  location: String,
  venue: String,
  isOnline: {
    type: Boolean,
    default: false
  },
  meetingLink: String,
  
  // Eligibility
  eligibleBranches: [String],
  eligibleBatches: [String],
  
  // Related application stage
  stageNumber: Number,
  
  // Participants
  participants: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'missed'],
      default: 'registered'
    }
  }],
  
  // Notifications
  notificationSent: {
    type: Boolean,
    default: false
  },
  
  // Status
  status: {
    type: String,
    enum: Object.values(EVENT_STATUS),
    default: EVENT_STATUS.SCHEDULED
  }

}, { timestamps: true });

module.exports = mongoose.model('PlacementEvent', placementEventSchema);
