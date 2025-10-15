const express = require('express');
const router = express.Router();
const DiscussionMessage = require('../models/DiscussionMessage');
const { authenticateToken } = require('../middleware/auth');

// Get messages for a specific channel/company
router.get('/channel/:companyId/:channelName', authenticateToken, async (req, res) => {
  try {
    const { companyId, channelName } = req.params;
    const { limit = 50, before } = req.query;
    
    let query = {
      companyId,
      channelName,
      isDeleted: false
    };
    
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }
    
    const messages = await DiscussionMessage.find(query)
      .populate('senderId', 'fullName universityRegisterNumber')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send a message
router.post('/send', authenticateToken, async (req, res) => {
  try {
    const { companyId, channelType, channelName, message, messageType, attachmentUrl, attachmentName, replyTo } = req.body;
    
    const newMessage = new DiscussionMessage({
      companyId,
      channelType,
      channelName,
      senderId: req.user.studentId,
      message,
      messageType: messageType || 'text',
      attachmentUrl,
      attachmentName,
      replyTo
    });
    
    await newMessage.save();
    
    // If it's a reply, add to parent's replies array
    if (replyTo) {
      await DiscussionMessage.findByIdAndUpdate(
        replyTo,
        { $push: { replies: newMessage._id } }
      );
    }
    
    // Populate sender info before sending response
    await newMessage.populate('senderId', 'fullName universityRegisterNumber');
    
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Edit a message
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    
    const existingMessage = await DiscussionMessage.findOne({
      _id: req.params.id,
      senderId: req.user.studentId
    });
    
    if (!existingMessage) {
      return res.status(404).json({ message: 'Message not found or unauthorized' });
    }
    
    existingMessage.message = message;
    existingMessage.isEdited = true;
    await existingMessage.save();
    
    res.json(existingMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a message
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const message = await DiscussionMessage.findOne({
      _id: req.params.id,
      senderId: req.user.studentId
    });
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found or unauthorized' });
    }
    
    message.isDeleted = true;
    message.message = 'This message has been deleted';
    await message.save();
    
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add reaction to a message
router.post('/:id/react', authenticateToken, async (req, res) => {
  try {
    const { emoji } = req.body;
    
    const message = await DiscussionMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Check if user already reacted with this emoji
    const existingReaction = message.reactions.find(
      r => r.userId.toString() === req.user.studentId && r.emoji === emoji
    );
    
    if (existingReaction) {
      // Remove reaction
      message.reactions = message.reactions.filter(
        r => !(r.userId.toString() === req.user.studentId && r.emoji === emoji)
      );
    } else {
      // Add reaction
      message.reactions.push({
        emoji,
        userId: req.user.studentId
      });
    }
    
    await message.save();
    res.json(message.reactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all channels for a company
router.get('/channels/:companyId', authenticateToken, async (req, res) => {
  try {
    const channels = await DiscussionMessage.distinct('channelName', {
      companyId: req.params.companyId
    });
    
    res.json(channels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all companies the student has access to (applied companies + general)
router.get('/my-forums', authenticateToken, async (req, res) => {
  try {
    const StudentApplication = require('../models/StudentApplication');
    const Company = require('../models/Company');
    
    // Get student's applied companies
    const applications = await StudentApplication.find({
      studentId: req.user.studentId
    }).populate('companyId', 'name logo');
    
    // Get all companies (for general access)
    const allCompanies = await Company.find({ isActive: true })
      .select('name logo')
      .sort({ name: 1 });
    
    // Format response with channels
    const forums = allCompanies.map(company => {
      const hasApplied = applications.some(
        app => app.companyId._id.toString() === company._id.toString()
      );
      
      return {
        companyId: company._id,
        companyName: company.name,
        companyLogo: company.logo,
        hasApplied,
        channels: [
          { name: 'general', displayName: 'General Discussion', icon: '💬' },
          { name: 'interview-tips', displayName: 'Interview Tips', icon: '💡' },
          { name: 'test-prep', displayName: 'Test Preparation', icon: '📝' },
          { name: 'results', displayName: 'Results & Updates', icon: '📊' },
          { name: 'off-topic', displayName: 'Off Topic', icon: '🎯' }
        ]
      };
    });
    
    res.json(forums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
