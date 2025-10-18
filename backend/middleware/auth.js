const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// Lazy load Student model
let Student;
const getStudentModel = () => {
  if (!Student) {
    Student = require('../models/Student');
  }
  return Student;
};

async function authenticateClerk(req, res, next) {
  try {
    const userId = req.auth.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const claims = req.auth.sessionClaims || {};
    const email = claims.email || claims.email_address || claims.primary_email_address;
    const firstName = claims.first_name || claims.firstName || '';
    const lastName = claims.last_name || claims.lastName || '';
    const fullName = claims.name || [firstName, lastName].filter(Boolean).join(' ') || (email ? email.split('@')[0] : 'User');
    
    const StudentModel = getStudentModel();
    let student;
    
    try {
      student = await StudentModel.findOne({ clerkId: userId });
    } catch (dbError) {
      console.error('Database error finding student by clerkId:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Database error during authentication'
      });
    }
    
    if (!student && email) {
      try {
        student = await StudentModel.findOne({ collegeEmail: email.toLowerCase() });
      } catch (dbError) {
        console.error('Database error finding student by email:', dbError);
        return res.status(500).json({
          success: false,
          message: 'Database error during authentication'
        });
      }
      
      if (student) {
        try {
          student.clerkId = userId;
          await student.save();
        } catch (saveError) {
          console.error('Error saving student:', saveError);
          return res.status(500).json({
            success: false,
            message: 'Failed to update student profile'
          });
        }
      } else {
        try {
          student = await StudentModel.create({
            clerkId: userId,
            collegeEmail: email.toLowerCase(),
            fullName: fullName,
            universityRegisterNumber: email.split('@')[0],
          });
        } catch (createError) {
          console.error('Error creating student:', createError);
          return res.status(500).json({
            success: false,
            message: 'Failed to create student profile'
          });
        }
      }
    }
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    req.user = {
      id: student._id,
      studentId: student._id,
      email: student.collegeEmail,
      name: student.fullName,
      registerNumber: student.universityRegisterNumber,
      clerkId: userId
    };

    console.log('Authentication successful for user:', {
      userId: student._id,
      email: student.collegeEmail,
      clerkId: userId
    });

    next();
  } catch (error) {
    console.error('Clerk auth error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed: ' + error.message
    });
  }
}

module.exports = {
  clerkMiddleware: ClerkExpressRequireAuth(),
  authenticateClerk,
  authenticate: async (req, res, next) => {
    console.log('Authentication middleware called for:', req.method, req.path);
    try {
      await ClerkExpressRequireAuth()(req, res, async () => {
        await authenticateClerk(req, res, next);
      });
      console.log('Authentication middleware completed successfully');
    } catch (error) {
      console.error('Authentication middleware error:', error);
      return res.status(401).json({
        success: false,
        message: 'Authentication failed'
      });
    }
  }
};
