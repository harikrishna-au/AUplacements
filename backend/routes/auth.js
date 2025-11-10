const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const StudentProfile = require('../models/StudentProfile');
const { authenticate } = require('../middleware/auth');

/**
 * GET /api/auth/me
 * Get current logged in user (protected route with Clerk)
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id)
      .select('-__v')
      .lean(); // Use lean() for better performance

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: student._id,
        name: student.fullName,
        email: student.collegeEmail,
        registerNumber: student.universityRegisterNumber,
        branch: student.branch,
        course: student.course,
        gender: student.gender,
        collegeName: student.collegeName,
        lastLoginAt: student.lastLoginAt
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user: ' + error.message
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (Clerk handles this on frontend)
 */
router.post('/logout', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * GET /api/auth/health
 * Check auth system health
 */
router.get('/health', (req, res) => {
  const isReady = !!process.env.CLERK_SECRET_KEY;
  
  res.json({
    success: true,
    data: {
      provider: 'clerk',
      ready: isReady,
      status: isReady ? 'healthy' : 'configuration_missing'
    }
  });
});

module.exports = router;
