const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { authenticate } = require('../middleware/auth');

// Get student profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-__v');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Transform data to use new field names (with fallbacks for old data)
    const studentData = student.toObject();
    
    // Map old field names to new ones if new ones don't exist
    if (!studentData.cgpa && studentData.auccCGPA) {
      studentData.cgpa = studentData.auccCGPA;
    }
    if (studentData.activeBacklogs === undefined && studentData.standingBacklogs !== undefined) {
      studentData.activeBacklogs = studentData.standingBacklogs;
    }
    if (!studentData.tenthPercentage && studentData.tenthCGPA) {
      studentData.tenthPercentage = studentData.tenthCGPA;
    }
    
    // Set historyOfBacklogs to 0 if not present
    if (studentData.historyOfBacklogs === undefined) {
      studentData.historyOfBacklogs = 0;
    }
    
    // Extract course from branch if course field is missing
    if (!studentData.course && studentData.branch) {
      // Branch format: "B.TECH-ELECTRICAL & ELECTRONICS ENGINEERING"
      const branchParts = studentData.branch.split('-');
      if (branchParts.length > 0) {
        studentData.course = branchParts[0].trim(); // "B.TECH"
      }
    }
    
    // Provide empty string defaults for optional fields
    studentData.phoneNumber = studentData.phoneNumber || '';
    studentData.currentAddress = studentData.currentAddress || '';
    studentData.permanentAddress = studentData.permanentAddress || '';
    studentData.portfolioUrl = studentData.portfolioUrl || '';
    studentData.linkedinUrl = studentData.linkedinUrl || '';
    studentData.githubUrl = studentData.githubUrl || '';
    
    // Convert "N/A" to empty string for diploma and other optional fields
    if (studentData.diplomaPercentage === 'N/A') {
      studentData.diplomaPercentage = '';
    } else {
      studentData.diplomaPercentage = studentData.diplomaPercentage || '';
    }

    res.json({
      success: true,
      data: studentData
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

    // Only allow updating specific fields
    const updateData = {};
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (currentAddress !== undefined) updateData.currentAddress = currentAddress;
    if (permanentAddress !== undefined) updateData.permanentAddress = permanentAddress;
    if (tenthPercentage !== undefined) updateData.tenthPercentage = tenthPercentage;
    if (twelfthPercentage !== undefined) updateData.twelfthPercentage = twelfthPercentage;
    if (diplomaPercentage !== undefined) updateData.diplomaPercentage = diplomaPercentage;
    if (portfolioUrl !== undefined) updateData.portfolioUrl = portfolioUrl;
    if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl;
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl;

    const student = await Student.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: student
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Upload resume (placeholder - will add file handling later)
router.post('/resume', authenticate, async (req, res) => {
  try {
    // TODO: Implement file upload with multer
    res.status(501).json({
      success: false,
      message: 'Resume upload not yet implemented'
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload resume'
    });
  }
});

module.exports = router;
