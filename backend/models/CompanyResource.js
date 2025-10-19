const mongoose = require('mongoose');

const companyResourceSchema = new mongoose.Schema({
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
  
  resourceType: {
    type: String,
    enum: ['pdf', 'video', 'link'],
    required: true
  },
  
  category: {
    type: String,
    enum: ['Interview Prep', 'Coding Practice', 'Aptitude Tests', 'Resume Building', 'Company Info', 'Other'],
    required: true
  },
  
  // File details
  fileUrl: String,
  fileName: String,
  fileSize: Number,
  
  // External link
  externalUrl: String,
  
  // Metadata
  uploadedBy: {
    type: String,
    ref: 'Student'
  },
  
  // Stats
  downloads: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  approvedBy: {
    type: String,
    ref: 'Student'
  },
  
  approvedDate: Date

}, { timestamps: true });

module.exports = mongoose.model('CompanyResource', companyResourceSchema);
