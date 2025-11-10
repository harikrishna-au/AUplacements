const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// Get all events from companies
router.get('/', authenticate, async (req, res) => {
  try {
    const Company = require('../models/Company');
    const { startDate, endDate, companyId } = req.query;
    
    // Build aggregation pipeline for better performance
    const pipeline = [
      { $match: { 'events.0': { $exists: true } } },
      { $unwind: '$events' }
    ];
    
    // Add company filter if provided
    if (companyId) {
      pipeline[0].$match._id = require('mongoose').Types.ObjectId(companyId);
    }
    
    // Add date range filter if provided
    if (startDate && endDate) {
      pipeline.push({
        $match: {
          'events.startDate': {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      });
    }
    
    // Project the final shape
    pipeline.push({
      $project: {
        _id: '$events._id',
        title: '$events.title',
        type: '$events.type',
        description: '$events.description',
        startDate: '$events.startDate',
        endDate: '$events.endDate',
        location: '$events.location',
        mode: '$events.mode',
        companyId: {
          _id: '$_id',
          name: '$name',
          logo: '$logo'
        }
      }
    });
    
    // Sort by start date
    pipeline.push({ $sort: { startDate: 1 } });
    
    const allEvents = await Company.aggregate(pipeline);
    res.json(allEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get events for student (based on their applications and eligibility)
router.get('/my-events', authenticate, async (req, res) => {
  try {
    const StudentApplication = require('../models/StudentApplication');
    const Company = require('../models/Company');
    
    console.log('📅 Fetching events for student:', req.user.studentId);
    
    // Use aggregation pipeline for better performance
    const appliedCompanyIds = await StudentApplication.distinct('companyId', { 
      studentId: req.user.studentId 
    });
    
    console.log('📅 Applied company IDs:', appliedCompanyIds);
    
    // Use aggregation to get events from applied companies
    const allEvents = await Company.aggregate([
      {
        $match: {
          _id: { $in: appliedCompanyIds },
          'events.0': { $exists: true }
        }
      },
      { $unwind: '$events' },
      {
        $project: {
          _id: '$events._id',
          title: '$events.title',
          type: '$events.type',
          description: '$events.description',
          startDate: '$events.startDate',
          endDate: '$events.endDate',
          location: '$events.location',
          mode: '$events.mode',
          maxCapacity: '$events.maxCapacity',
          participants: '$events.participants',
          companyId: {
            _id: '$_id',
            name: '$name',
            logo: '$logo'
          }
        }
      },
      { $sort: { startDate: 1 } }
    ]);
    
    console.log('📅 Total events found:', allEvents.length);
    
    res.json(allEvents);
  } catch (error) {
    console.error('📅 Error fetching events:', error);
    res.status(500).json({ message: error.message });
  }
});

// Register for an event
router.post('/:companyId/:eventId/register', authenticate, async (req, res) => {
  try {
    const Company = require('../models/Company');
    const { companyId, eventId } = req.params;
    
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    const event = company.events.id(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const alreadyRegistered = event.participants.some(
      p => p.studentId === req.user.studentId
    );
    
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }
    
    event.participants.push({
      studentId: req.user.studentId,
      status: 'registered'
    });
    
    await company.save();
    res.json({ message: 'Successfully registered for event' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update event attendance status
router.put('/:companyId/:eventId/attendance', authenticate, async (req, res) => {
  try {
    const Company = require('../models/Company');
    const { companyId, eventId } = req.params;
    const { status } = req.body;
    
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    const event = company.events.id(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const participant = event.participants.find(
      p => p.studentId === req.user.studentId
    );
    
    if (!participant) {
      return res.status(404).json({ message: 'Not registered for this event' });
    }
    
    participant.status = status;
    await company.save();
    res.json({ message: 'Attendance status updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get event details
router.get('/:companyId/:eventId', authenticate, async (req, res) => {
  try {
    const Company = require('../models/Company');
    const { companyId, eventId } = req.params;
    
    const company = await Company.findById(companyId).select('name logo events').lean();
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    const event = company.events.find(e => e._id.toString() === eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json({
      ...event,
      companyId: { _id: company._id, name: company.name, logo: company.logo }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
