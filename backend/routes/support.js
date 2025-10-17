const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const { authenticate } = require('../middleware/auth');

// Get all tickets for the authenticated student
router.get('/my-tickets', authenticate, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ 
      studentId: req.user.studentId 
    })
    .sort({ createdAt: -1 });
    
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
    });
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    res.json(ticket);
  } catch (error) {
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

// Get ticket statistics for the student
router.get('/stats', authenticate, async (req, res) => {
  try {
    const studentId = req.user.studentId;
    
    const [total, pending, inProgress, resolved, closed] = await Promise.all([
      SupportTicket.countDocuments({ studentId }),
      SupportTicket.countDocuments({ studentId, status: 'pending' }),
      SupportTicket.countDocuments({ studentId, status: 'in-progress' }),
      SupportTicket.countDocuments({ studentId, status: 'resolved' }),
      SupportTicket.countDocuments({ studentId, status: 'closed' })
    ]);
    
    res.json({
      total,
      pending,
      inProgress,
      resolved,
      closed
    });
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
