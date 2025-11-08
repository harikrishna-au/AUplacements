const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  logo: String,
  description: String,
  industry: String,
  website: String,
  
  // Placement details
  rolesOffered: [String],
  eligibilityCriteria: {
    minCGPA: Number,
    allowedBranches: [String],
    maxBacklogs: Number,
    graduationYear: [Number]
  },
  
  // Recruitment process stages
  recruitmentStages: [{
    stageName: String,
    order: Number,
    description: String
  }],
  
  // Company stats
  stats: {
    totalApplications: { type: Number, default: 0 },
    totalSelected: { type: Number, default: 0 },
    averagePackage: String,
    highestPackage: String
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Campus Drive Flag - Only companies with this enabled appear in Pipeline & Calendar
  isCampusDrive: {
    type: Boolean,
    default: false
  },
  
  // Important dates & events
  registrationDeadline: Date,
  placementDriveDate: Date,
  
  // Placement Events/Schedule
  events: [{
    title: String,
    type: {
      type: String,
      enum: ['pre-placement', 'test', 'interview', 'group-discussion', 'drive', 'result'],
      default: 'pre-placement'
    },
    description: String,
    startDate: Date,
    endDate: Date,
    location: String,
    mode: {
      type: String,
      enum: ['online', 'offline', 'hybrid'],
      default: 'offline'
    },
    maxCapacity: Number,
    participants: [{
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
      },
      status: {
        type: String,
        enum: ['registered', 'attended', 'missed'],
        default: 'registered'
      },
      registeredAt: {
        type: Date,
        default: Date.now
      }
    }]
  }]
  
}, { timestamps: true });

// Indexes for common queries
companySchema.index({ isActive: 1, name: 1 }); // For listing active companies
companySchema.index({ isActive: 1, isCampusDrive: 1 }); // For campus drive filtering
companySchema.index({ 'events.startDate': 1 }); // For event date queries

module.exports = mongoose.model('Company', companySchema);
