const { verifyToken } = require('../utils/jwt');
const Student = require('../models/Student');

/**
 * Middleware to protect routes - requires valid JWT token
 */
async function authenticate(req, res, next) {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyToken(token);

    // Check if it's a session token
    if (decoded.type !== 'session') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    // Get student from database
    const student = await Student.findById(decoded.id);
    
    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Attach student to request
    req.user = {
      id: student._id,
      studentId: student._id, // Add this for backwards compatibility
      email: student.collegeEmail,
      name: student.fullName,
      registerNumber: student.universityRegisterNumber
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed: ' + error.message
    });
  }
}

// Export both names for backwards compatibility
module.exports = { 
  authenticate,
  authenticateToken: authenticate // Alias for routes that use authenticateToken
};
