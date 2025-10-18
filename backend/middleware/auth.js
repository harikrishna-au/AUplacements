const { ClerkExpressRequireAuth, clerkClient } = require('@clerk/clerk-sdk-node');

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
    console.log('authenticateClerk started');
    const userId = req.auth.userId;
    console.log('Clerk userId:', userId);
    
    if (!userId) {
      console.log('No userId found in req.auth');
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // Fetch user details from Clerk API since JWT doesn't include email
    console.log('Fetching user details from Clerk API...');
    const clerkUser = await clerkClient.users.getUser(userId);
    console.log('Clerk user:', clerkUser.emailAddresses);
    
    const email = clerkUser.emailAddresses?.[0]?.emailAddress;
    const firstName = clerkUser.firstName || '';
    const lastName = clerkUser.lastName || '';
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || clerkUser.username || (email ? email.split('@')[0] : 'User');
    console.log('Extracted email:', email, 'fullName:', fullName);
    
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

    console.log('✅ Authentication successful for user:', {
      userId: student._id,
      email: student.collegeEmail,
      clerkId: userId
    });
    console.log('Calling next() to proceed to route handler');

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
  authenticate: (req, res, next) => {
    console.log('Authentication middleware called for:', req.method, req.path);
    ClerkExpressRequireAuth()(req, res, (err) => {
      if (err) {
        console.error('Clerk auth error:', err);
        return res.status(401).json({
          success: false,
          message: 'Authentication failed'
        });
      }
      authenticateClerk(req, res, next);
    });
  }
};
