# ECharge - Charging Station Management System

A full-stack application for managing electric vehicle charging stations.

## Features

- User authentication (signup/login) with JWT
- CRUD operations for charging stations
- Interactive map view of all charging stations
- Filtering and searching capabilities
- Responsive design

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

### Frontend
- Vue.js 3 (with Composition API)
- Tailwind CSS
- Vue Router
- Axios
- Leaflet (for maps)

## Project Structure

```
ECharge/
├── backend/         # Express.js server
├── frontend/        # Vue.js client
└── README.md        # This file
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/echarge
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## API Documentation

### Swagger UI
Once the backend server is running, you can access the Swagger UI documentation at:
```
http://localhost:5000/api-docs
```

This interactive documentation allows you to:
- Explore all available API endpoints
- Understand request/response formats
- Test API endpoints directly from the browser

### Postman Collection
A Postman collection is also available for testing the API:

1. Import the collection file from:
   ```
   backend/echarge-postman-collection.json
   ```

2. Set up the environment variables in Postman:
   - `baseUrl`: `http://localhost:5000/api`
   - `authToken`: Your JWT token after login
   - `stationId`: ID of a station you want to interact with
   - `reviewId`: ID of a review you want to interact with
   - `bookmarkId`: ID of a bookmark you want to interact with

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login and get JWT token
- GET /api/auth/me - Get current user details

### Charging Stations
- GET /api/stations - Get all charging stations
- GET /api/stations/:id - Get a specific charging station
- POST /api/stations - Create a new charging station (protected)
- PUT /api/stations/:id - Update a charging station (protected)
- DELETE /api/stations/:id - Delete a charging station (protected)

### Reviews
- GET /api/stations/:stationId/reviews - Get all reviews for a station
- POST /api/stations/:stationId/reviews - Add a review to a station (protected)
- PUT /api/stations/:stationId/reviews/:reviewId - Update a review (protected)
- DELETE /api/stations/:stationId/reviews/:reviewId - Delete a review (protected)

### Bookmarks
- GET /api/bookmarks - Get user's bookmarks (protected)
- POST /api/bookmarks - Create a bookmark (protected)
- DELETE /api/bookmarks/:id - Delete a bookmark (protected)

## Deployment

The application is deployed at:
- Frontend: [ECharge App](https://echarge-app.example.com)
- Backend API: [ECharge API](https://echarge-api.example.com/api) 