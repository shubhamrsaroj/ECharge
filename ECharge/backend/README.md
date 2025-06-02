# ECharge Backend

## Email Configuration

The ECharge system uses email for password reset and verification. For security reasons, email credentials are not hardcoded in the application but are loaded from environment variables.

### Setting Up Email

1. Create a `.env` file in the backend directory (copy from `env.example`)
2. Configure your email settings:

```
# Email Configuration
EMAIL_SEND=true  # Set to 'true' to send actual emails
EMAIL_HOST=smtp.gmail.com  # Or your email provider's SMTP server
EMAIL_PORT=587  # Common ports: 587 (TLS) or 465 (SSL)
EMAIL_SECURE=false  # Set to 'true' for port 465
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
EMAIL_FROM="ECharge System <your_email@gmail.com>"
```

### Using Gmail

If you're using Gmail:

1. Enable 2-Step Verification on your Google account
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. Create an App Password
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" as the app and your device
   - Click "Generate"
   - Use the generated 16-character password as your `EMAIL_PASS`

### Development Mode

If you don't want to send actual emails during development:
- Set `EMAIL_SEND=false` in your `.env` file
- The system will log email content to the console instead of sending actual emails

### Other Email Providers

For other email providers, you'll need:
- SMTP server hostname
- Port number
- Whether to use SSL/TLS
- Your email address
- Your password or app-specific password

## Running the Application

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

3. For development with auto-restart:
   ```
   npm run dev
   ``` 