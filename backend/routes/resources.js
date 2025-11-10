const express = require('express');
const router = express.Router();
const CompanyResource = require('../models/CompanyResource');
const { authenticate } = require('../middleware/auth');

// Get resources for a company
router.get('/company/:companyId', authenticate, async (req, res) => {
  try {
    const resources = await CompanyResource.find({ 
      companyId: req.params.companyId,
      status: 'approved'
    })
    .populate('uploadedBy', 'fullName universityRegisterNumber')
    .sort({ createdAt: -1 })
    .lean(); // Use lean() for better performance
    
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all approved resources grouped by company
router.get('/all', authenticate, async (req, res) => {
  try {
    const resources = await CompanyResource.find({ status: 'approved' })
      .populate('companyId', 'name logo')
      .populate('uploadedBy', 'fullName')
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for better performance
    
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Contribute a resource
router.post('/contribute', authenticate, async (req, res) => {
  try {
    const { companyId, title, description, resourceType, category, fileUrl, fileName, fileSize, externalUrl } = req.body;
    
    const resource = new CompanyResource({
      companyId,
      title,
      description,
      resourceType,
      category,
      fileUrl,
      fileName,
      fileSize,
      externalUrl,
      uploadedBy: req.user.studentId,
      status: 'pending' // Requires admin approval
    });
    
    await resource.save();
    
    res.status(201).json({ 
      message: 'Resource submitted for approval',
      resource 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Increment download count
router.post('/:id/download', authenticate, async (req, res) => {
  try {
    const resource = await CompanyResource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    resource.downloads += 1;
    await resource.save();
    
    res.json({ downloads: resource.downloads });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Increment view count
router.post('/:id/view', authenticate, async (req, res) => {
  try {
    const resource = await CompanyResource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    resource.views += 1;
    await resource.save();
    
    res.json({ views: resource.views });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rate a resource
router.post('/:id/rate', authenticate, async (req, res) => {
  try {
    const { rating } = req.body;
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    const resource = await CompanyResource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Update rating
    const totalRating = resource.rating.average * resource.rating.count + rating;
    resource.rating.count += 1;
    resource.rating.average = totalRating / resource.rating.count;
    
    await resource.save();
    
    res.json({ 
      averageRating: resource.rating.average,
      totalRatings: resource.rating.count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's contributed resources
router.get('/my-contributions', authenticate, async (req, res) => {
  try {
    const resources = await CompanyResource.find({ 
      uploadedBy: req.user.studentId 
    })
    .populate('companyId', 'name logo')
    .sort({ createdAt: -1 })
    .lean(); // Use lean() for better performance
    
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
