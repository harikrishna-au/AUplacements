const express = require('express');
const router = express.Router();
const PlacementEvent = require('../models/PlacementEvent');
const { EVENT_STATUS } = require('../utils/constants');
const { authenticate } = require('../middleware/auth');

// Get all events
router.get('/', authenticate, async (req, res) => {
  try {
    const { startDate, endDate, companyId } = req.query;
    
    let query = {};
    
    if (companyId) {
      query.companyId = companyId;
    }
    
    if (startDate && endDate) {
      query.startDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const events = await PlacementEvent.find(query)
      .populate('companyId', 'name logo')
      .sort({ startDate: 1 });
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get events for student (based on their applications and eligibility)
router.get('/my-events', authenticate, async (req, res) => {
  try {
    const StudentApplication = require('../models/StudentApplication');
    const Student = require('../models/Student');
    
    // Get student details
    const student = await Student.findById(req.user.studentId);
    
    // Get student's applied companies
    const applications = await StudentApplication.find({
      studentId: req.user.studentId
    }).select('companyId');
    
    const appliedCompanyIds = applications.map(app => app.companyId);
    
    // Get events for applied companies or matching eligibility
    const events = await PlacementEvent.find({
      $or: [
        { companyId: { $in: appliedCompanyIds } },
        { eligibleBranches: student.branch },
        { eligibleBranches: { $size: 0 } } // Events open to all
      ],
      status: { $ne: EVENT_STATUS.CANCELLED }
    })
    .populate('companyId', 'name logo')
    .sort({ startDate: 1 });
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register for an event
router.post('/:id/register', authenticate, async (req, res) => {
  try {
    const event = await PlacementEvent.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if already registered
    const alreadyRegistered = event.participants.some(
      p => p.studentId.toString() === req.user.studentId
    );
    
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }
    
    event.participants.push({
      studentId: req.user.studentId,
      status: 'registered'
    });
    
    await event.save();
    
    res.json({ message: 'Successfully registered for event' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update event attendance status
router.put('/:id/attendance', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    
    const event = await PlacementEvent.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const participant = event.participants.find(
      p => p.studentId.toString() === req.user.studentId
    );
    
    if (!participant) {
      return res.status(404).json({ message: 'Not registered for this event' });
    }
    
    participant.status = status;
    await event.save();
    
    res.json({ message: 'Attendance status updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get event details
router.get('/:id', authenticate, async (req, res) => {
  try {
    const event = await PlacementEvent.findById(req.params.id)
      .populate('companyId', 'name logo description')
      .populate('participants.studentId', 'fullName universityRegisterNumber');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
