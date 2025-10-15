const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = '7d'; // 1 week session

/**
 * Generate JWT token for authenticated user
 */
function generateToken(studentId, email, fullName) {
  return jwt.sign(
    { 
      id: studentId,
      email: email,
      name: fullName,
      type: 'session'
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Generate magic link token (short-lived)
 */
function generateMagicToken(studentId, email) {
  return jwt.sign(
    {
      id: studentId,
      email: email,
      type: 'magic-link'
    },
    JWT_SECRET,
    { expiresIn: '15m' } // 15 minutes
  );
}

/**
 * Verify JWT token
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

module.exports = {
  generateToken,
  generateMagicToken,
  verifyToken,
  JWT_SECRET
};
