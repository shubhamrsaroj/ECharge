# ECharge - Charging Station Management System

ECharge is a full-stack web application for managing electric vehicle charging stations. It allows users to find, review, and bookmark charging stations, while station owners can manage their charging points.

## Features

- **User Authentication**: Secure registration and login system
- **Charging Station Management**: Add, edit, and delete charging stations
- **Station Search**: Find charging stations with advanced filtering options
- **Reviews & Ratings**: Leave reviews and ratings for charging stations
- **Bookmarks**: Save favorite charging stations for quick access
- **Admin Dashboard**: Manage users, stations, and reviews
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

### Frontend
- Vue.js 3
- Tailwind CSS
- Pinia for state management
- Vue Router

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd ECharge/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd ECharge/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## API Documentation

API documentation is available via Swagger UI at `/api-docs` when the server is running.

## Security Features

- JWT Authentication
- Password hashing
- Authorization middleware
- Input validation
- Protection against common web vulnerabilities

## License

MIT License 