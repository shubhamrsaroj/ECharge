const express = require('express');
const { check } = require('express-validator');
const { 
  register, 
  login, 
  getMe, 
  forgotPassword, 
  verifyOTP, 
  resetPassword,
  setPasswordDirectly
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Register route with validation
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({
      min: 6,
    }),
  ],
  register
);

// Login route with validation
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  login
);

// Get current user route (protected)
router.get('/me', protect, getMe);

// Forgot password route
router.post(
  '/forgot-password',
  [
    check('email', 'Please include a valid email').isEmail(),
  ],
  forgotPassword
);

// Verify OTP route
router.post(
  '/verify-otp',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('otp', 'Verification code is required').not().isEmpty(),
  ],
  verifyOTP
);

// Reset password route
router.post(
  '/reset-password',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('otp', 'Verification code is required').not().isEmpty(),
    check('password', 'Password must be at least 6 characters').isLength({
      min: 6,
    }),
  ],
  resetPassword
);

// Temporary route to set password directly (for debugging only)
router.post(
  '/set-password-directly',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  setPasswordDirectly
);

module.exports = router; 