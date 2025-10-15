const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const StudentApplication = require('../models/StudentApplication');
const { authenticate } = require('../middleware/auth');

// Get all active companies
router.get('/companies', authenticate, async (req, res) => {
  try {
    const companies = await Company.find({ isActive: true })
      .select('name logo description industry rolesOffered eligibilityCriteria stats')
      .sort({ name: 1 });
    
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get company details by ID
router.get('/companies/:id', authenticate, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student's applications (their personal pipeline)
router.get('/my-applications', authenticate, async (req, res) => {
  try {
    const applications = await StudentApplication.find({ 
      studentId: req.user.studentId 
    })
    .populate('companyId', 'name logo rolesOffered recruitmentStages')
    .sort({ appliedDate: -1 });
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Apply to a company
router.post('/apply', authenticate, async (req, res) => {
  try {
    const { companyId } = req.body;
    
    // Check if already applied
    const existingApplication = await StudentApplication.findOne({
      studentId: req.user.studentId,
      companyId: companyId
    });
    
    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied to this company' });
    }
    
    // Get company details
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    // Create application
    const application = new StudentApplication({
      studentId: req.user.studentId,
      companyId: companyId,
      currentStage: 1,
      stageHistory: [{
        stageNumber: 1,
        stageName: company.recruitmentStages[0]?.stageName || 'Applied',
        status: 'pending'
      }]
    });
    
    await application.save();
    
    // Update company stats
    company.stats.totalApplications += 1;
    await company.save();
    
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update application stage
router.put('/applications/:id/stage', authenticate, async (req, res) => {
  try {
    const { stageNumber, stageName, status, score, feedback } = req.body;
    
    const application = await StudentApplication.findOne({
      _id: req.params.id,
      studentId: req.user.studentId
    });
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Update current stage
    application.currentStage = stageNumber;
    
    // Add to stage history
    application.stageHistory.push({
      stageNumber,
      stageName,
      status,
      score,
      feedback,
      completedDate: new Date()
    });
    
    // Update overall status
    if (status === 'failed') {
      application.status = 'rejected';
    } else if (stageNumber === 5 && status === 'cleared') {
      application.status = 'selected';
    } else {
      application.status = 'in-progress';
    }
    
    application.lastUpdated = new Date();
    await application.save();
    
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Withdraw application
router.put('/applications/:id/withdraw', authenticate, async (req, res) => {
  try {
    const application = await StudentApplication.findOne({
      _id: req.params.id,
      studentId: req.user.studentId
    });
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    application.status = 'withdrawn';
    application.lastUpdated = new Date();
    await application.save();
    
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get application statistics
router.get('/my-stats', authenticate, async (req, res) => {
  try {
    const applications = await StudentApplication.find({ 
      studentId: req.user.studentId 
    });
    
    const stats = {
      totalApplications: applications.length,
      inProgress: applications.filter(a => a.status === 'in-progress').length,
      selected: applications.filter(a => a.status === 'selected').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
      withdrawn: applications.filter(a => a.status === 'withdrawn').length
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
