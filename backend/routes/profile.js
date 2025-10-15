const express = require('express');
const router = express.Router();
const StudentProfile = require('../models/StudentProfile');
const Student = require('../models/Student');
const { authenticate } = require('../middleware/auth');

/**
 * GET /api/profile
 * Get current student's complete profile
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ studentId: req.user.id })
      .populate('studentId', 'fullName collegeEmail universityRegisterNumber course branch')
      .populate('placementStats.companiesApplied', 'name logo');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Calculate latest profile completion
    profile.calculateProfileCompletion();
    await profile.save();

    res.json({
      success: true,
      data: profile
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile: ' + error.message
    });
  }
});

/**
 * PUT /api/profile
 * Update student profile
 */
router.put('/', authenticate, async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ studentId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Allowed fields to update
    const allowedUpdates = [
      'phoneNumber',
      'currentSemester',
      'technicalSkills',
      'softSkills',
      'programmingLanguages',
      'frameworks',
      'certifications',
      'projects',
      'internships',
      'careerPreferences',
      'socialLinks',
      'preferences',
      'privacySettings'
    ];

    // Update only allowed fields
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        profile[key] = req.body[key];
      }
    });

    // Update academic details if provided
    if (req.body.academicDetails) {
      profile.academicDetails = {
        ...profile.academicDetails,
        ...req.body.academicDetails
      };
    }

    // Update last profile update time
    profile.activityLog.lastProfileUpdate = new Date();

    // Recalculate profile completion
    profile.calculateProfileCompletion();

    await profile.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile: ' + error.message
    });
  }
});

/**
 * POST /api/profile/documents/resume
 * Upload resume
 */
router.post('/documents/resume', authenticate, async (req, res) => {
  try {
    const { url, fileName, fileSize } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'Resume URL is required'
      });
    }

    const profile = await StudentProfile.findOne({ studentId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    profile.documents.resume = {
      url,
      fileName,
      fileSize,
      uploadedAt: new Date()
    };

    // Recalculate profile completion
    profile.calculateProfileCompletion();

    await profile.save();

    // Also update Student model for backward compatibility
    await Student.findByIdAndUpdate(req.user.id, { resumeUrl: url });

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        resume: profile.documents.resume,
        profileCompletionPercentage: profile.profileCompletionPercentage
      }
    });

  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload resume: ' + error.message
    });
  }
});

/**
 * POST /api/profile/documents/photo
 * Upload profile photo
 */
router.post('/documents/photo', authenticate, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'Photo URL is required'
      });
    }

    const profile = await StudentProfile.findOne({ studentId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    profile.documents.photo = {
      url,
      uploadedAt: new Date()
    };

    // Recalculate profile completion
    profile.calculateProfileCompletion();

    await profile.save();

    res.json({
      success: true,
      message: 'Photo uploaded successfully',
      data: {
        photo: profile.documents.photo,
        profileCompletionPercentage: profile.profileCompletionPercentage
      }
    });

  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload photo: ' + error.message
    });
  }
});

/**
 * GET /api/profile/stats
 * Get profile statistics
 */
router.get('/stats', authenticate, async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ studentId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Update placement stats
    await profile.updatePlacementStats();

    res.json({
      success: true,
      data: {
        profileCompletion: profile.profileCompletionPercentage,
        placementStats: profile.placementStats,
        activityLog: profile.activityLog,
        flags: profile.flags
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get stats: ' + error.message
    });
  }
});

/**
 * POST /api/profile/skills
 * Add skills to profile
 */
router.post('/skills', authenticate, async (req, res) => {
  try {
    const { technicalSkills, softSkills, programmingLanguages, frameworks } = req.body;

    const profile = await StudentProfile.findOne({ studentId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    if (technicalSkills) profile.technicalSkills = technicalSkills;
    if (softSkills) profile.softSkills = softSkills;
    if (programmingLanguages) profile.programmingLanguages = programmingLanguages;
    if (frameworks) profile.frameworks = frameworks;

    profile.activityLog.lastProfileUpdate = new Date();
    profile.calculateProfileCompletion();

    await profile.save();

    res.json({
      success: true,
      message: 'Skills updated successfully',
      data: {
        technicalSkills: profile.technicalSkills,
        softSkills: profile.softSkills,
        programmingLanguages: profile.programmingLanguages,
        frameworks: profile.frameworks,
        profileCompletionPercentage: profile.profileCompletionPercentage
      }
    });

  } catch (error) {
    console.error('Update skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update skills: ' + error.message
    });
  }
});

/**
 * POST /api/profile/projects
 * Add project to profile
 */
router.post('/projects', authenticate, async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ studentId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    profile.projects.push(req.body);
    profile.activityLog.lastProfileUpdate = new Date();
    profile.calculateProfileCompletion();

    await profile.save();

    res.json({
      success: true,
      message: 'Project added successfully',
      data: {
        projects: profile.projects,
        profileCompletionPercentage: profile.profileCompletionPercentage
      }
    });

  } catch (error) {
    console.error('Add project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add project: ' + error.message
    });
  }
});

/**
 * POST /api/profile/internships
 * Add internship to profile
 */
router.post('/internships', authenticate, async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ studentId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    profile.internships.push(req.body);
    profile.activityLog.lastProfileUpdate = new Date();
    profile.calculateProfileCompletion();

    await profile.save();

    res.json({
      success: true,
      message: 'Internship added successfully',
      data: {
        internships: profile.internships,
        profileCompletionPercentage: profile.profileCompletionPercentage
      }
    });

  } catch (error) {
    console.error('Add internship error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add internship: ' + error.message
    });
  }
});

/**
 * POST /api/profile/certifications
 * Add certification to profile
 */
router.post('/certifications', authenticate, async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ studentId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    profile.certifications.push(req.body);
    profile.activityLog.lastProfileUpdate = new Date();
    profile.calculateProfileCompletion();

    await profile.save();

    res.json({
      success: true,
      message: 'Certification added successfully',
      data: {
        certifications: profile.certifications,
        profileCompletionPercentage: profile.profileCompletionPercentage
      }
    });

  } catch (error) {
    console.error('Add certification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add certification: ' + error.message
    });
  }
});

module.exports = router;
