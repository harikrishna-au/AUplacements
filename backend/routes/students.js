const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const StudentProfile = require('../models/StudentProfile');
const { authenticate } = require('../middleware/auth');

// Get student profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const profile = await StudentProfile.findById(req.user.id).select('-__v');
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const profileData = profile.toObject();
    
    // Extract CGPA from academicDetails if needed
    if (profileData.academicDetails?.cgpa) {
      profileData.cgpa = profileData.academicDetails.cgpa;
    }
    if (profileData.academicDetails?.activeBacklogs !== undefined) {
      profileData.activeBacklogs = profileData.academicDetails.activeBacklogs;
    }
    if (profileData.academicDetails?.historyOfBacklogs !== undefined) {
      profileData.historyOfBacklogs = profileData.academicDetails.historyOfBacklogs;
    }
    if (profileData.academicDetails?.tenthPercentage) {
      profileData.tenthPercentage = profileData.academicDetails.tenthPercentage;
    }
    if (profileData.academicDetails?.twelfthPercentage) {
      profileData.twelfthPercentage = profileData.academicDetails.twelfthPercentage;
    }
    if (profileData.academicDetails?.diplomaPercentage) {
      profileData.diplomaPercentage = profileData.academicDetails.diplomaPercentage;
    }
    
    // Extract social links
    if (profileData.socialLinks?.portfolio) {
      profileData.portfolioUrl = profileData.socialLinks.portfolio;
    }
    if (profileData.socialLinks?.linkedin) {
      profileData.linkedinUrl = profileData.socialLinks.linkedin;
    }
    if (profileData.socialLinks?.github) {
      profileData.githubUrl = profileData.socialLinks.github;
    }
    
    // Extract resume URL from documents
    if (profileData.documents?.resume?.url) {
      profileData.resumeUrl = profileData.documents.resume.url;
    }


    
    res.json({
      success: true,
      data: profileData
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// Update student profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const {
      phoneNumber,
      currentAddress,
      permanentAddress,
      tenthPercentage,
      twelfthPercentage,
      diplomaPercentage,
      portfolioUrl,
      linkedinUrl,
      githubUrl
    } = req.body;

    const updateData = {};
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (currentAddress !== undefined) updateData.currentAddress = currentAddress;
    if (permanentAddress !== undefined) updateData.permanentAddress = permanentAddress;
    
    // Update nested academic details
    if (tenthPercentage !== undefined) updateData['academicDetails.tenthPercentage'] = tenthPercentage;
    if (twelfthPercentage !== undefined) updateData['academicDetails.twelfthPercentage'] = twelfthPercentage;
    if (diplomaPercentage !== undefined) updateData['academicDetails.diplomaPercentage'] = diplomaPercentage;
    
    // Update nested social links
    if (portfolioUrl !== undefined) updateData['socialLinks.portfolio'] = portfolioUrl;
    if (linkedinUrl !== undefined) updateData['socialLinks.linkedin'] = linkedinUrl;
    if (githubUrl !== undefined) updateData['socialLinks.github'] = githubUrl;
    
    // Update last profile update timestamp
    updateData['activityLog.lastProfileUpdate'] = new Date();

    const profile = await StudentProfile.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
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
      message: 'Failed to update profile'
    });
  }
});



module.exports = router;
