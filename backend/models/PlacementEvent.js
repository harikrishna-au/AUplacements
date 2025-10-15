const mongoose = require('mongoose');

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
    enum: ['pre-placement-talk', 'aptitude-test', 'technical-interview', 'hr-interview', 'group-discussion', 'placement-drive', 'result', 'other'],
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
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  }

}, { timestamps: true });

module.exports = mongoose.model('PlacementEvent', placementEventSchema);
