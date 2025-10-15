const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const PlacementEvent = require('../models/PlacementEvent');
const { authenticate } = require('../middleware/auth');

// NOTE: In the future, add role-based auth (e.g., isAdmin) on top of authenticate

// Create a new company
router.post('/', authenticate, async (req, res) => {
  try {
    const payload = req.body;

    const company = new Company({
      name: payload.name,
      logo: payload.logo,
      description: payload.description,
      industry: payload.industry,
      website: payload.website,
      rolesOffered: payload.rolesOffered,
      eligibilityCriteria: payload.eligibilityCriteria,
      recruitmentStages: payload.recruitmentStages,
      stats: payload.stats,
      isActive: payload.isActive !== undefined ? payload.isActive : true,
      registrationDeadline: payload.registrationDeadline,
      placementDriveDate: payload.placementDriveDate,
    });

    const saved = await company.save();
    res.status(201).json(saved);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Company with this name already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Update an existing company
router.put('/:id', authenticate, async (req, res) => {
  try {
    const update = req.body;
    const updated = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all companies (optionally include inactive)
router.get('/', authenticate, async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const filter = includeInactive ? {} : { isActive: true };
    const companies = await Company.find(filter).sort({ name: 1 });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/companies/bulk-upload
 * Bulk upload companies with events
 * Automatically creates:
 * - Companies
 * - Calendar Events for each company
 */
router.post('/bulk-upload', authenticate, async (req, res) => {
  try {
    const { companies } = req.body;

    if (!companies || !Array.isArray(companies)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format. Expected { companies: [...] }'
      });
    }

    const results = {
      companiesCreated: 0,
      companiesUpdated: 0,
      eventsCreated: 0,
      errors: []
    };

    for (const companyData of companies) {
      try {
        // Check if company exists
        let company = await Company.findOne({ name: companyData.name });

        if (company) {
          // Update existing company
          Object.assign(company, {
            logo: companyData.logo || company.logo,
            description: companyData.description || company.description,
            industry: companyData.industry || company.industry,
            website: companyData.website || company.website,
            rolesOffered: companyData.rolesOffered || company.rolesOffered,
            eligibilityCriteria: companyData.eligibilityCriteria || company.eligibilityCriteria,
            recruitmentStages: companyData.recruitmentStages || company.recruitmentStages,
            stats: companyData.stats || company.stats,
            isActive: companyData.isActive !== undefined ? companyData.isActive : company.isActive,
            registrationDeadline: companyData.registrationDeadline || company.registrationDeadline,
            placementDriveDate: companyData.placementDriveDate || company.placementDriveDate,
            events: companyData.events || company.events
          });
          await company.save();
          results.companiesUpdated++;
        } else {
          // Create new company
          company = await Company.create({
            name: companyData.name,
            logo: companyData.logo,
            description: companyData.description,
            industry: companyData.industry,
            website: companyData.website,
            rolesOffered: companyData.rolesOffered || [],
            eligibilityCriteria: companyData.eligibilityCriteria || {},
            recruitmentStages: companyData.recruitmentStages || [],
            stats: companyData.stats || {},
            isActive: companyData.isActive !== undefined ? companyData.isActive : true,
            registrationDeadline: companyData.registrationDeadline,
            placementDriveDate: companyData.placementDriveDate,
            events: companyData.events || []
          });
          results.companiesCreated++;
        }

        // Create calendar events for this company
        if (companyData.events && Array.isArray(companyData.events)) {
          for (const eventData of companyData.events) {
            // Check if event already exists
            const existingEvent = await PlacementEvent.findOne({
              companyId: company._id,
              title: eventData.title,
              startDate: eventData.startDate
            });

            if (!existingEvent) {
              await PlacementEvent.create({
                title: eventData.title,
                type: eventData.type || 'pre-placement',
                description: eventData.description,
                companyId: company._id,
                startDate: new Date(eventData.startDate),
                endDate: new Date(eventData.endDate),
                location: eventData.location,
                mode: eventData.mode || 'offline',
                maxCapacity: eventData.maxCapacity,
                eligibility: companyData.eligibilityCriteria || {}
              });
              results.eventsCreated++;
            }
          }
        }

      } catch (error) {
        results.errors.push({
          company: companyData.name,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: 'Bulk upload completed',
      results
    });

  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Bulk upload failed: ' + error.message
    });
  }
});

module.exports = router;


