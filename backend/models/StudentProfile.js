const mongoose = require('mongoose');

/**
 * StudentProfile Model
 * Created automatically when a student first logs in
 * Used across the application for tickets, resources, applications, etc.
 */
const studentProfileSchema = new mongoose.Schema({
  // Link to Student account
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    unique: true
  },

  // Basic Info (synced from Student model)
  universityRegisterNumber: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  collegeEmail: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: String,
  course: String,
  branch: String,
  currentSemester: Number,

  // Profile Status
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  profileCompletionPercentage: {
    type: Number,
    default: 0
  },

  // Academic Performance
  academicDetails: {
    cgpa: String,
    activeBacklogs: {
      type: Number,
      default: 0
    },
    historyOfBacklogs: {
      type: Number,
      default: 0
    },
    tenthPercentage: String,
    twelfthPercentage: String,
    diplomaPercentage: String,
    isEligibleForPlacements: {
      type: Boolean,
      default: true
    }
  },

  // Skills & Interests
  technicalSkills: [String],
  softSkills: [String],
  programmingLanguages: [String],
  frameworks: [String],
  certifications: [{
    name: String,
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    credentialUrl: String
  }],
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    githubUrl: String,
    liveUrl: String,
    startDate: Date,
    endDate: Date
  }],
  
  // Internships & Experience
  internships: [{
    company: String,
    role: String,
    startDate: Date,
    endDate: Date,
    description: String,
    location: String,
    type: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid']
    }
  }],

  // Career Preferences
  careerPreferences: {
    preferredRoles: [String],
    preferredIndustries: [String],
    preferredLocations: [String],
    expectedSalary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'INR'
      }
    },
    willingToRelocate: {
      type: Boolean,
      default: true
    },
    jobType: {
      type: String,
      enum: ['full-time', 'internship', 'both'],
      default: 'both'
    }
  },

  // Online Presence
  socialLinks: {
    portfolio: String,
    linkedin: String,
    github: String,
    twitter: String,
    medium: String,
    stackoverflow: String
  },

  // Documents
  documents: {
    resume: {
      url: String,
      uploadedAt: Date,
      fileName: String,
      fileSize: Number
    },
    photo: {
      url: String,
      uploadedAt: Date
    },
    marksheets: [{
      type: {
        type: String,
        enum: ['10th', '12th', 'diploma', 'sem1', 'sem2', 'sem3', 'sem4', 'sem5', 'sem6', 'sem7', 'sem8']
      },
      url: String,
      uploadedAt: Date
    }],
    certificates: [{
      name: String,
      url: String,
      uploadedAt: Date
    }]
  },

  // Application Statistics (auto-updated)
  placementStats: {
    totalApplications: {
      type: Number,
      default: 0
    },
    shortlisted: {
      type: Number,
      default: 0
    },
    rejected: {
      type: Number,
      default: 0
    },
    selected: {
      type: Number,
      default: 0
    },
    companiesApplied: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    }]
  },

  // Activity Tracking
  activityLog: {
    lastLogin: Date,
    lastProfileUpdate: Date,
    lastApplicationSubmitted: Date,
    totalLogins: {
      type: Number,
      default: 0
    }
  },

  // Support Tickets (for reference)
  supportTickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SupportTicket'
  }],

  // Resources Contributed
  contributedResources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyResource'
  }],

  // Notifications & Preferences
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    },
    pushNotifications: {
      type: Boolean,
      default: true
    },
    notifyOnNewCompany: {
      type: Boolean,
      default: true
    },
    notifyOnShortlist: {
      type: Boolean,
      default: true
    },
    notifyOnDeadline: {
      type: Boolean,
      default: true
    }
  },

  // Privacy Settings
  privacySettings: {
    showPhoneNumber: {
      type: Boolean,
      default: false
    },
    showEmail: {
      type: Boolean,
      default: true
    },
    allowResourceSharing: {
      type: Boolean,
      default: true
    },
    profileVisibility: {
      type: String,
      enum: ['public', 'students-only', 'private'],
      default: 'students-only'
    }
  },

  // Notes (for admin/placement officer)
  adminNotes: [{
    note: String,
    addedBy: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Flags
  flags: {
    isBlacklisted: {
      type: Boolean,
      default: false
    },
    isPlaced: {
      type: Boolean,
      default: false
    },
    placedCompany: String,
    placementDate: Date,
    packageOffered: Number,
    hasActiveOffer: {
      type: Boolean,
      default: false
    }
  }

}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Indexes for better query performance
// Note: studentId, universityRegisterNumber, and collegeEmail indexes are already created
// via the "unique: true" option in the schema, so we only need these additional indexes:
studentProfileSchema.index({ 'flags.isPlaced': 1 });
studentProfileSchema.index({ 'academicDetails.cgpa': 1 });

// Virtual for profile completion percentage calculation
studentProfileSchema.methods.calculateProfileCompletion = function() {
  let completed = 0;
  const total = 10; // Total sections

  if (this.phoneNumber) completed++;
  if (this.academicDetails.cgpa) completed++;
  if (this.technicalSkills && this.technicalSkills.length > 0) completed++;
  if (this.documents.resume && this.documents.resume.url) completed++;
  if (this.documents.photo && this.documents.photo.url) completed++;
  if (this.socialLinks.linkedin) completed++;
  if (this.careerPreferences.preferredRoles && this.careerPreferences.preferredRoles.length > 0) completed++;
  if (this.projects && this.projects.length > 0) completed++;
  if (this.certifications && this.certifications.length > 0) completed++;
  if (this.internships && this.internships.length > 0) completed++;

  const percentage = Math.round((completed / total) * 100);
  this.profileCompletionPercentage = percentage;
  this.isProfileComplete = percentage === 100;

  return percentage;
};

// Method to update placement stats
studentProfileSchema.methods.updatePlacementStats = async function() {
  const StudentApplication = mongoose.model('StudentApplication');
  
  const applications = await StudentApplication.find({ studentId: this.studentId });
  
  this.placementStats.totalApplications = applications.length;
  this.placementStats.shortlisted = applications.filter(app => app.status === 'shortlisted').length;
  this.placementStats.rejected = applications.filter(app => app.status === 'rejected').length;
  this.placementStats.selected = applications.filter(app => app.status === 'selected').length;
  this.placementStats.companiesApplied = [...new Set(applications.map(app => app.companyId))];
  
  await this.save();
};

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
