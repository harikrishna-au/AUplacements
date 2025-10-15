const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  slNo: Number,
  universityRegisterNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  gender: String,
  nationality: String,
  dateOfBirth: String,
  collegeName: String,
  course: String,
  branch: String,
  personalEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  collegeEmail: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  
  // Contact Information (editable)
  phoneNumber: String,
  currentAddress: String,
  permanentAddress: String,
  
  // Academic details - support both old and new field names
  cgpa: String, // Current CGPA (new field name)
  auccCGPA: String, // Old field name (for backward compatibility)
  activeBacklogs: { // Active/standing backlogs (new)
    type: Number,
    default: 0
  },
  standingBacklogs: Number, // Old field name (for backward compatibility)
  historyOfBacklogs: { // Total backlog history (new)
    type: Number,
    default: 0
  },
  
  // Previous Education (editable) - support both old and new
  tenthPercentage: String,
  tenthCGPA: String, // Old field name (for backward compatibility)
  tenthBoard: String,
  tenthYearOfPass: String,
  twelfthPercentage: String,
  twelfthBoard: String,
  twelfthYearOfPass: String,
  diplomaPercentage: String,
  diplomaBoard: String,
  diplomaState: String,
  diplomaYearOfPass: String,
  
  btechYearOfPass: String,
  hasBacklogHistory: String,
  completedInTime: String,
  admissionEntranceTest: String,
  entranceTestRank: String,
  category: String,
  isPwD: String,
  pwdDetails: String,
  hasPAN: String,
  hasPassport: String,
  hasLaptop: String,
  hasInternet: String,
  
  // Online Presence (editable)
  portfolioUrl: String,
  linkedinUrl: String,
  githubUrl: String,
  
  // Resume
  resumeUrl: String,
  // Auth fields
  lastLoginAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster email lookups
studentSchema.index({ collegeEmail: 1 });
studentSchema.index({ universityRegisterNumber: 1 });

module.exports = mongoose.model('Student', studentSchema);
