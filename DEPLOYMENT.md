# ECharge Deployment Guide

This guide explains how to deploy the ECharge application with the frontend on Netlify and the backend on Render.

## Frontend Deployment (Netlify)

### Prerequisites
- A Netlify account
- Git repository with your ECharge code

### Steps

1. **Push your code to GitHub** (if you haven't already)
   ```
   git push origin master
   ```

2. **Log in to Netlify**
   - Go to [Netlify](https://app.netlify.com/)
   - Log in or sign up for an account

3. **Create a new site**
   - Click "New site from Git"
   - Select GitHub as your Git provider
   - Authorize Netlify to access your GitHub account
   - Select your ECharge repository

4. **Configure build settings**
   - Build command: `cd ECharge/frontend && npm install && npm run build`
   - Publish directory: `ECharge/frontend/dist`

5. **Configure environment variables**
   - Go to Site settings > Build & deploy > Environment
   - Add the following environment variable:
     - Key: `VITE_API_URL`
     - Value: `https://echarge-api.onrender.com/api` (your Render backend URL)

6. **Deploy the site**
   - Click "Deploy site"
   - Wait for the build to complete

7. **Set up redirects**
   - Netlify should automatically use the redirects in your netlify.toml file
   - This ensures that your SPA routes work correctly

## Backend Deployment (Render)

### Prerequisites
- A Render account
- MongoDB Atlas database (or another MongoDB provider)
- Git repository with your ECharge code

### Steps

1. **Set up MongoDB Atlas** (if you haven't already)
   - Create a cluster
   - Set up a database user
   - Get your connection string

2. **Log in to Render**
   - Go to [Render](https://dashboard.render.com/)
   - Log in or sign up for an account

3. **Create a new Web Service**
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Select the repository with your ECharge code

4. **Configure the service**
   - Name: `echarge-api` (or your preferred name)
   - Environment: `Node`
   - Build Command: `cd ECharge/backend && npm install`
   - Start Command: `cd ECharge/backend && npm start`
   - Select the appropriate instance type (Free tier works for testing)

5. **Add environment variables**
   - Scroll down to the "Environment" section
   - Add the following variables:
     - `NODE_ENV`: `production`
     - `PORT`: `10000` (Render will override this with its own port)
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A secure random string for JWT signing
     - `JWT_EXPIRE`: `30d` (or your preferred expiration time)

6. **Deploy the service**
   - Click "Create Web Service"
   - Wait for the build and deployment to complete

7. **Test the API**
   - Once deployed, test the API by visiting `https://your-service-name.onrender.com/health`
   - You should see a response: `{"status":"ok","message":"Server is running"}`

## Connecting Frontend and Backend

Make sure your frontend is configured to use the backend API URL:

1. The environment variable `VITE_API_URL` should be set to your Render backend URL
2. Test the complete application by logging in and using various features

## Troubleshooting

### Frontend Issues
- Check Netlify deploy logs for build errors
- Verify environment variables are set correctly
- Test API connectivity from the browser console

### Backend Issues
- Check Render logs for startup errors
- Verify MongoDB connection is working
- Test API endpoints using tools like Postman

## Maintenance

- Monitor application performance and logs
- Set up automatic deployments for future code changes
- Consider upgrading to paid plans for production use 