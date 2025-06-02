# Setting Up Gmail for Sending Emails in ECharge

This guide will help you set up your Gmail account to send emails from your ECharge application.

## Step 1: Enable 2-Step Verification

1. Go to your Google Account settings: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Scroll down to "Signing in to Google" and click on "2-Step Verification"
4. Follow the steps to enable 2-Step Verification

## Step 2: Generate an App Password

1. After enabling 2-Step Verification, go back to the Security page
2. Click on "App passwords" (you may need to sign in again)
3. Select "Mail" as the app and "Other (Custom name)" as the device
4. Enter "ECharge" as the name and click "Generate"
5. Google will display a 16-character app password
6. Copy this password - you'll need it for the next step

## Step 3: Set Up Environment Variables

Create a `.env` file in the `ECharge/backend` directory with the following content:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/echarge

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=1d

# Email Configuration
EMAIL_USER=your-gmail-account@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM="ECharge System <your-gmail-account@gmail.com>"
```

Replace:
- `your-gmail-account@gmail.com` with your actual Gmail address
- `your-16-character-app-password` with the app password generated in Step 2
- `your_jwt_secret_key_here` with a secure random string for JWT token signing

## Step 4: Restart Your Server

After setting up the environment variables, restart your server:

```
cd ECharge/backend
npm run dev
```

## Step 5: Test the Email Functionality

1. Try the forgot password functionality
2. Enter your email address
3. Check your email inbox for the verification code
4. If you don't receive an email, check your spam folder
5. Also check the server console for any error messages

## Troubleshooting

If you encounter issues:

1. Check the server console for error messages
2. Verify that your Gmail account doesn't have additional security restrictions
3. Make sure you're using an app password, not your regular Gmail password
4. Check if your Gmail has exceeded sending limits (Gmail has daily sending limits)
5. Try using a different Gmail account

For more information, visit: https://support.google.com/mail/answer/185833 