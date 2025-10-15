const mongoose = require('mongoose');

const discussionMessageSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  
  channelType: {
    type: String,
    enum: ['company', 'general'],
    required: true
  },
  
  channelName: {
    type: String,
    required: true
  },
  
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  
  message: {
    type: String,
    required: true,
    trim: true
  },
  
  // Message type
  messageType: {
    type: String,
    enum: ['text', 'file', 'image', 'link'],
    default: 'text'
  },
  
  // File attachment
  attachmentUrl: String,
  attachmentName: String,
  
  // Reactions and interactions
  reactions: [{
    emoji: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    }
  }],
  
  // Thread/Reply support
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiscussionMessage'
  },
  
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiscussionMessage'
  }],
  
  // Status
  isEdited: {
    type: Boolean,
    default: false
  },
  
  isDeleted: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

// Index for faster queries
discussionMessageSchema.index({ companyId: 1, channelName: 1, createdAt: -1 });

module.exports = mongoose.model('DiscussionMessage', discussionMessageSchema);
