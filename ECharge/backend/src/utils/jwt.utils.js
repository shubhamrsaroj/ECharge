const jwt = require('jsonwebtoken');

// Generate JWT token
exports.generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRY || '7d',
    }
  );
}; 