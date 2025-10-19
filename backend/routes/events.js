const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// Get all events from companies
router.get('/', authenticate, async (req, res) => {
  try {
    const Company = require('../models/Company');
    const { startDate, endDate, companyId } = req.query;
    
    let query = { 'events.0': { $exists: true } };
    
    if (companyId) {
      query._id = companyId;
    }
    
    const companies = await Company.find(query).select('name logo events');
    
    const allEvents = [];
    companies.forEach(company => {
      company.events.forEach(event => {
        if (startDate && endDate) {
          const eventStart = new Date(event.startDate);
          if (eventStart >= new Date(startDate) && eventStart <= new Date(endDate)) {
            allEvents.push({
              _id: event._id,
              title: event.title,
              type: event.type,
              description: event.description,
              startDate: event.startDate,
              endDate: event.endDate,
              location: event.location,
              mode: event.mode,
              companyId: { _id: company._id, name: company.name, logo: company.logo }
            });
          }
        } else {
          allEvents.push({
            _id: event._id,
            title: event.title,
            type: event.type,
            description: event.description,
            startDate: event.startDate,
            endDate: event.endDate,
            location: event.location,
            mode: event.mode,
            companyId: { _id: company._id, name: company.name, logo: company.logo }
          });
        }
      });
    });
    
    allEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    res.json(allEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get events for student (based on their applications and eligibility)
router.get('/my-events', authenticate, async (req, res) => {
  try {
    const StudentProfile = require('../models/StudentProfile');
    const Company = require('../models/Company');
    
    console.log('📅 Fetching events for student:', req.user.studentId);
    
    // Get student profile with applied companies
    const studentProfile = await StudentProfile.findById(req.user.studentId);
    
    // Get applied company IDs from StudentProfile
    const appliedCompanyIds = studentProfile?.placementStats?.companiesApplied || [];
    console.log('📅 Applied company IDs:', appliedCompanyIds);
    
    // Get companies with events that student has applied to
    const companies = await Company.find({
      _id: { $in: appliedCompanyIds },
      'events.0': { $exists: true } // Has at least one event
    });
    
    console.log('📅 Found companies with events:', companies.length);
    
    // Extract all events from companies
    const allEvents = [];
    companies.forEach(company => {
      company.events.forEach(event => {
        allEvents.push({
          _id: event._id,
          title: event.title,
          type: event.type,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
          location: event.location,
          mode: event.mode,
          maxCapacity: event.maxCapacity,
          participants: event.participants,
          companyId: {
            _id: company._id,
            name: company.name,
            logo: company.logo
          }
        });
      });
    });
    
    // Sort by start date
    allEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    
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
    
    const company = await Company.findById(companyId).select('name logo events');
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    const event = company.events.id(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json({
      ...event.toObject(),
      companyId: { _id: company._id, name: company.name, logo: company.logo }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
