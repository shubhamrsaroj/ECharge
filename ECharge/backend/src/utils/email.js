const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Generate a random 6-digit OTP
 * @returns {string} 6-digit OTP
 */
exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Create and configure email transporter based on environment
 * @returns {object} Configured nodemailer transporter
 */
const createTransporter = () => {
  try {
    // Create a transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER || 'your-gmail-account@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });
    
    console.log('Email transporter created successfully');
    return transporter;
  } catch (error) {
    console.error('Error creating email transporter:', error);
    
    // Fallback to development mode if there's an error
    return {
      sendMail: async (mailOptions) => {
        const otpMatch = mailOptions.html.match(/\d{6}/);
        const otp = otpMatch ? otpMatch[0] : 'OTP not found';
        
        console.log('\n');
        console.log('*'.repeat(50));
        console.log('*'.repeat(50));
        console.log(`*     EMAIL SENDING FAILED - FALLBACK TO DEV MODE`);
        console.log(`*     TO: ${mailOptions.to}`);
        console.log(`*     SUBJECT: ${mailOptions.subject}`);
        console.log(`*`);
        console.log(`*     OTP CODE: ${otp}`);
        console.log(`*     (OTP only shown in console, never sent to frontend)`);
        console.log(`*`);
        console.log('*'.repeat(50));
        console.log('*'.repeat(50));
        console.log('\n');
        
        return { messageId: 'dev-mode-message-id' };
      }
    };
  }
};

/**
 * Send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - Email body (HTML)
 * @returns {Promise<boolean>} - True if email sent successfully, false otherwise
 */
exports.sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"ECharge System" <${process.env.EMAIL_USER || 'noreply@echarge.com'}>`,
      to,
      subject,
      html,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    
    // Extract OTP for logging purposes (only shown in server logs)
    const otpMatch = html.match(/\d{6}/);
    const otp = otpMatch ? otpMatch[0] : 'OTP not found';
    console.log(`OTP sent to ${to}: ${otp} (only shown in server logs)`);
    
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    
    // Extract OTP for fallback display in console
    const otpMatch = html.match(/\d{6}/);
    const otp = otpMatch ? otpMatch[0] : 'OTP not found';
    
    console.log('\n');
    console.log('*'.repeat(50));
    console.log(`* FAILED TO SEND EMAIL - OTP CODE: ${otp}`);
    console.log(`* TO: ${to}`);
    console.log(`* (OTP only shown in console, never sent to frontend)`);
    console.log('*'.repeat(50));
    console.log('\n');
    
    return false;
  }
};

/**
 * Send OTP email for password reset
 * @param {string} to - Recipient email address
 * @param {string} otp - The OTP code
 * @returns {Promise<boolean>} - True if email sent successfully
 */
exports.sendOTPEmail = async (to, otp) => {
  const subject = 'Password Reset Verification Code';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #2e7d32;">ECharge Password Reset</h2>
      </div>
      <p>Hello,</p>
      <p>You have requested to reset your password. Please use the verification code below to complete the process:</p>
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0; border-radius: 4px;">
        <h2 style="margin: 0; color: #2e7d32; letter-spacing: 5px;">${otp}</h2>
      </div>
      <p>This code will expire in <strong>15 minutes</strong>.</p>
      <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
      <p style="margin-top: 30px; font-size: 12px; color: #757575; text-align: center;">
        This is an automated message, please do not reply.
      </p>
    </div>
  `;
  
  return await exports.sendEmail(to, subject, html);
}; 