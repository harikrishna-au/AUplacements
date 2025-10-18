const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Student = require('../models/Student');
const StudentProfile = require('../models/StudentProfile');
const MagicLink = require('../models/MagicLink');
const { sendMagicLinkEmail } = require('../services/emailService');
const { generateToken, generateMagicToken, verifyToken } = require('../utils/jwt');
const { authenticate } = require('../middleware/auth');
const { verifyEmailConfig } = require('../services/emailService');

/**
 * POST /api/auth/send-magic-link
 * Send magic link to student's college email
 */
router.post('/send-magic-link', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Validate email format (must be AU email)
    if (!normalizedEmail.endsWith('@andhrauniversity.edu.in')) {
      return res.status(400).json({
        success: false,
        message: 'Please use your Andhra University email address (rollnumber@andhrauniversity.edu.in)'
      });
    }

    // Find or create student in database
    let student = await Student.findOne({ collegeEmail: normalizedEmail });
    if (!student) {
      // Derive roll number from email local-part
      const rollNumber = normalizedEmail.split('@')[0];
      // Create a minimal profile immediately so subsequent entities can reference this student
      student = await Student.create({
        fullName: rollNumber, // Placeholder; can be updated later from records
        collegeEmail: normalizedEmail,
        universityRegisterNumber: rollNumber,
      });
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Create magic link record
    const magicLink = new MagicLink({
      email: normalizedEmail,
      token: token,
      studentId: student._id,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    });

    await magicLink.save();

    // Generate magic link URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const magicLinkUrl = `${frontendUrl}/auth/verify?token=${token}`;

    // Send email
    await sendMagicLinkEmail(normalizedEmail, student.fullName, magicLinkUrl);

    res.json({
      success: true,
      message: `Magic link sent to ${normalizedEmail}. Please check your inbox.`,
      data: {
        email: normalizedEmail,
        expiresIn: '15 minutes'
      }
    });

  } catch (error) {
    console.error('Send magic link error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send magic link: ' + error.message
    });
  }
});

/**
 * GET /api/auth/verify/:token
 * Verify magic link and login user
 */
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    // Find magic link
    const magicLink = await MagicLink.findOne({ token }).populate('studentId');

    if (!magicLink) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired magic link'
      });
    }

    // Check if already used
    if (magicLink.isUsed) {
      return res.status(400).json({
        success: false,
        message: 'This magic link has already been used'
      });
    }

    // Check if expired
    if (new Date() > magicLink.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'This magic link has expired. Please request a new one.'
      });
    }

    // Mark as used
    magicLink.isUsed = true;
    await magicLink.save();

    const student = magicLink.studentId;

    // Update last login
    student.lastLoginAt = new Date();
    await student.save();

    // Create or update StudentProfile on first login
    let studentProfile = await StudentProfile.findOne({ studentId: student._id });
    
    if (!studentProfile) {
      // First time login - create profile
      studentProfile = await StudentProfile.create({
        studentId: student._id,
        universityRegisterNumber: student.universityRegisterNumber,
        fullName: student.fullName,
        collegeEmail: student.collegeEmail,
        phoneNumber: student.phoneNumber,
        course: student.course,
        branch: student.branch,
        academicDetails: {
          cgpa: student.cgpa || student.auccCGPA,
          activeBacklogs: student.activeBacklogs || student.standingBacklogs || 0,
          historyOfBacklogs: student.historyOfBacklogs || 0,
          tenthPercentage: student.tenthPercentage || student.tenthCGPA,
          twelfthPercentage: student.twelfthPercentage,
          diplomaPercentage: student.diplomaPercentage
        },
        socialLinks: {
          portfolio: student.portfolioUrl,
          linkedin: student.linkedinUrl,
          github: student.githubUrl
        },
        documents: {
          resume: student.resumeUrl ? {
            url: student.resumeUrl,
            uploadedAt: new Date()
          } : undefined
        },
        activityLog: {
          lastLogin: new Date(),
          totalLogins: 1
        }
      });
      
      console.log('✅ Created StudentProfile for:', student.collegeEmail);
    } else {
      // Existing user - update login stats
      studentProfile.activityLog.lastLogin = new Date();
      studentProfile.activityLog.totalLogins += 1;
      await studentProfile.save();
      
      console.log('✅ Updated login for:', student.collegeEmail);
    }

    // Generate session JWT token (7 days)
    const sessionToken = generateToken(student._id, student.collegeEmail, student.fullName);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token: sessionToken,
        user: {
          id: student._id,
          profileId: studentProfile._id,
          name: student.fullName,
          email: student.collegeEmail,
          registerNumber: student.universityRegisterNumber,
          branch: student.branch,
          course: student.course,
          isProfileComplete: studentProfile.isProfileComplete,
          profileCompletionPercentage: studentProfile.profileCompletionPercentage
        }
      }
    });

  } catch (error) {
    console.error('Verify magic link error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify magic link: ' + error.message
    });
  }
});

/**
 * GET /api/auth/me
 * Get current logged in user (protected route)
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-__v');

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
 * Logout user (client should delete token)
 */
router.post('/logout', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * GET /api/auth/email-health
 * Check email provider readiness
 */
router.get('/email-health', async (req, res) => {
  try {
    const status = await verifyEmailConfig();
    res.json({ success: true, data: status });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
