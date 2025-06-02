const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { generateOTP, sendOTPEmail } = require('../utils/email');
const { validationResult } = require('express-validator');

// Store OTPs temporarily (in a production app, use Redis or another persistent store)
const otpStore = new Map();

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Enforce strong password (optional)
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    // Return user data (excluding password) and token
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    res.status(201).json({ user: userData, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);
    console.log(`Password length: ${password ? password.length : 'undefined'}`);
    console.log(`Password first 2 chars: ${password ? password.substring(0, 2) : 'undefined'}...`);

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log(`User not found: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    console.log(`User found: ${email}, checking password...`);
    console.log(`User ID: ${user._id}`);
    console.log(`Stored password hash length: ${user.password ? user.password.length : 'undefined'}`);
    console.log(`Stored password hash first 10 chars: ${user.password ? user.password.substring(0, 10) : 'undefined'}...`);
    
    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password match result: ${isMatch}`);
    
    // Try direct method comparison as well
    const isMatchDirect = await user.matchPassword(password);
    console.log(`Direct password match result: ${isMatchDirect}`);
    
    if (!isMatch) {
      console.log(`Password mismatch for user: ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    console.log(`Login successful for user: ${email}`);
    
    // Return user data (excluding password) and token
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.status(200).json({ user: userData, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Forgot password - send OTP
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a 6-digit OTP
    const otp = generateOTP();
    
    // Store OTP with expiration (15 minutes)
    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    // Send email with OTP using the new function
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send verification email' });
    }

    // Never include OTP in response for security
    res.json({ 
      message: 'Verification code sent to your email'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if OTP exists for this email
    const storedOTPData = otpStore.get(email);
    if (!storedOTPData) {
      return res.status(400).json({ message: 'No verification code found. Please request a new one.' });
    }

    // Check if OTP is expired
    if (Date.now() > storedOTPData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
    }

    // Verify OTP
    if (otp !== storedOTPData.otp) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // OTP is valid, but don't delete it yet as we need it for the reset password step
    res.json({ message: 'Verification code is valid' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    console.log(`Reset password attempt for email: ${email}`);
    console.log(`Password being reset (first 2 chars): ${password.substring(0, 2)}...`);
    console.log(`Password length: ${password.length}`);

    // Verify OTP again
    const storedOTPData = otpStore.get(email);
    if (!storedOTPData || otp !== storedOTPData.otp || Date.now() > storedOTPData.expiresAt) {
      console.log(`Invalid or expired OTP for email: ${email}`);
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log(`User not found during password reset: ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Password validation
    if (password.length < 6) {
      console.log(`Password too short during reset for email: ${email}`);
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Enforce strong password
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!strongPasswordRegex.test(password)) {
      console.log(`Weak password during reset for email: ${email}`);
      return res.status(400).json({ 
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' 
      });
    }

    // Check if the new password is the same as the old one
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      console.log(`User tried to reset with the same password: ${email}`);
      return res.status(400).json({ 
        message: 'New password cannot be the same as your current password. Please choose a different password.' 
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(`Password hashed for email: ${email}`);
    
    // Store original password for debugging
    const originalPassword = user.password || 'no-previous-password';

    // Update user password directly in the database to avoid pre-save hook issues
    await User.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } }
    );
    
    console.log(`Password updated successfully for email: ${email}`);
    console.log(`Old password hash: ${originalPassword.substring(0, 10) || 'none'}...`);
    console.log(`New password hash: ${hashedPassword.substring(0, 10)}...`);

    // Delete OTP
    otpStore.delete(email);

    // Verify the password was updated correctly
    const updatedUser = await User.findOne({ email }).select('+password');
    const isMatch = await bcrypt.compare(password, updatedUser.password);
    console.log(`Password verification after update: ${isMatch ? 'Success' : 'Failed'}`);

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Temporary endpoint to set password directly (for debugging only)
exports.setPasswordDirectly = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log(`Setting password directly for user: ${email}`);
    console.log(`New password (first 2 chars): ${password.substring(0, 2)}...`);
    console.log(`Password length: ${password.length}`);
    
    // Hash password manually (bypassing pre-save hook)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Update user password directly in the database
    await User.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );
    
    console.log(`Password updated directly for user: ${email}`);
    console.log(`New password hash: ${hashedPassword.substring(0, 10)}...`);
    
    // Test if the password can be verified
    const testUser = await User.findOne({ email }).select('+password');
    const isMatch = await bcrypt.compare(password, testUser.password);
    console.log(`Test password match: ${isMatch}`);
    
    res.json({ 
      message: 'Password updated directly',
      success: isMatch,
      passwordHash: hashedPassword.substring(0, 10) + '...'
    });
  } catch (error) {
    console.error('Set password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 