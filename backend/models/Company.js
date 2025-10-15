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
  
  // Important dates
  registrationDeadline: Date,
  placementDriveDate: Date
  
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
