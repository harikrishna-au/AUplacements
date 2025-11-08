const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const Feedback = require('../models/Feedback');
const { authenticate } = require('../middleware/auth');

// Get all tickets for the authenticated student (exclude feedback type)
router.get('/my-tickets', authenticate, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ 
      studentId: req.user.studentId,
      type: { $ne: 'feedback' }
    })
    .sort({ createdAt: -1 })
    .lean(); // Use lean() for better performance
    
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific ticket by ID
router.get('/tickets/:id', authenticate, async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      studentId: req.user.studentId
    }).lean(); // Use lean() for better performance
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Test endpoint
router.post('/feedback-test', async (req, res) => {
  console.log('TEST ENDPOINT HIT!');
  res.json({ message: 'Test successful', body: req.body });
});

// Submit feedback (no ticket created)
router.post('/feedback', authenticate, async (req, res) => {
  try {
    console.log('=== FEEDBACK SUBMISSION START ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User info:', JSON.stringify(req.user, null, 2));
    
    const { category, subject, message, rating } = req.body;
    
    if (!category || !subject || !message) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({ 
        message: 'Category, subject, and message are required' 
      });
    }
    
    const feedbackData = {
      studentId: req.user.studentId,
      category,
      subject,
      message,
      rating: rating || null,
      studentInfo: {
        name: req.user.name,
        email: req.user.email,
        registerNumber: req.user.registerNumber
      }
    };
    
    console.log('Creating feedback with data:', JSON.stringify(feedbackData, null, 2));
    
    const feedback = new Feedback(feedbackData);
    await feedback.save();
    
    console.log('✅ Feedback saved successfully!');
    console.log('Feedback ID:', feedback._id);
    console.log('=== FEEDBACK SUBMISSION END ===');
    
    res.status(201).json({ 
      message: 'Feedback submitted successfully',
      feedbackId: feedback._id
    });
  } catch (error) {
    console.error('❌ Error saving feedback:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: error.message });
  }
});

// Create a new ticket
router.post('/create', authenticate, async (req, res) => {
  try {
    const { 
      type, 
      category, 
      subject, 
      message, 
      priority, 
      rating,
      attachments 
    } = req.body;
    
    // Validation
    if (!type || !category || !subject || !message) {
      return res.status(400).json({ 
        message: 'Type, category, subject, and message are required' 
      });
    }
    
    const ticket = new SupportTicket({
      studentId: req.user.studentId,
      type,
      category,
      subject,
      message,
      priority: priority || 'medium',
      rating: rating || null,
      attachments: attachments || []
    });
    
    await ticket.save();
    
    // Populate student info for response
    await ticket.populate('studentId', 'fullName email universityRegisterNumber');
    
    res.status(201).json({ 
      message: 'Ticket created successfully',
      ticket 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update ticket status (for admin, but can be used to close tickets)
router.patch('/tickets/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'in-progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      studentId: req.user.studentId
    });
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    ticket.status = status;
    ticket.updatedAt = Date.now();
    await ticket.save();
    
    res.json({ 
      message: 'Ticket status updated',
      ticket 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add response to ticket (typically admin, but students can add comments)
router.post('/tickets/:id/response', authenticate, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Response message is required' });
    }
    
    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      studentId: req.user.studentId
    });
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    ticket.response = {
      message,
      respondedBy: 'Student',
      respondedAt: Date.now()
    };
    ticket.updatedAt = Date.now();
    await ticket.save();
    
    res.json({ 
      message: 'Response added successfully',
      ticket 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get ticket statistics for the student (exclude feedback type)
router.get('/stats', authenticate, async (req, res) => {
  try {
    const studentId = req.user.studentId;
    
    // Use aggregation for better performance instead of multiple countDocuments calls
    const stats = await SupportTicket.aggregate([
      {
        $match: {
          studentId,
          type: { $ne: 'feedback' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
          },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          closed: {
            $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] }
          }
        }
      }
    ]);
    
    // Return stats or default values if no tickets
    const result = stats.length > 0 ? stats[0] : {
      total: 0,
      pending: 0,
      inProgress: 0,
      resolved: 0,
      closed: 0
    };
    
    // Remove the _id field from response
    delete result._id;
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a ticket (only pending tickets)
router.delete('/tickets/:id', authenticate, async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      studentId: req.user.studentId,
      status: 'pending' // Only allow deleting pending tickets
    });
    
    if (!ticket) {
      return res.status(404).json({ 
        message: 'Ticket not found or cannot be deleted' 
      });
    }
    
    await ticket.deleteOne();
    
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
