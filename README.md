# Finlytics

A role-based Finance Dashboard Backend API built using Node.js, Express, MongoDB, and Mongoose, featuring secure authentication, robust authorization, dynamic analytics using aggregation and secure CRUD operations.

## 🚀 Features

- 🔐 Authentication & Security
  - User authentication using JWT (JSON Web Token)
  - Password hashing using bcrypt
  - Environment variables managed using .env
  - Input validation using Joi
  - Centralized error handling using custom middleware

## 👥 Role-Based Access Control
  - There are 3 types of users:
    - Viewer → Access only their own records & dashboard
    - Analyst → Access all records & analytics
    - Admin → Full control (users + records + roles)

## 📁 Core Functionalities

  - ✅ User Management
    - Signup & Login
    - Role assignment (Admin only)
    - Activate/Deactivate users (Admin only)
    - Search users by filters (Admin, Analyst)

  - 💰 Records Management (CRUD)
    - Add transactions
    - View records (role-based)
    - Update/Delete records (Admin only)

  - 📊 Dashboard & Analytics
    - Summary of transactions
    - Category-wise breakdown
    - Monthly trends
    - Recent transactions  

## 🛠️ Tech Stack
  - Backend: Node.js, Express.js
  - Database: MongoDB (Mongoose)
  - Authentication: JWT, bcrypt
  - Validation: Joi
  - Architecture: MVC - inspired architecture (Models, Controllers, Routes)
  - Error Handling: Custom middleware (ExpressError, wrapAsync)

## 🔑 API Endpoints

  - 🔐 Auth Routes
    - POST   /auth/signup  → Register user
    - POST   /auth/login → Login & get JWT
    - GET    /auth/me → Get current user
    - PUT  /auth/:id/status → Toggle user status (Admin only)
    - PUT  /auth/:id/role → Change user role (Admin only)
    - GET    /auth/search → Search users (Admin, Analyst)

  - 📁 Records Routes
    - GET    /records → Get records (role-based)
    - GET    /records/user/:id →Retrieve records for a specific user (Admin, Analyst)
    - GET    /records/search → Search records based on type, category, and date (role-based)
    - GET    /records/:id → Fetch a specific record using its ID (role-based)
    - POST   /records → Create record
    - PUT    /records/:id → Update record (Admin only)
    - DELETE /records/:id → Delete record (Admin only)

  - 📊 Dashboard Routes
    - GET /dashboard/summary → Financial summary (role-based)
    - GET /dashboard/category → Category-wise breakdown (role-based)
    - GET /dashboard/recent → Recent transactions (role-based)
    - GET /dashboard/trends → Monthly trends (role-based)

## ⚠️ Assumption
 - A default admin user is pre-created, and all user roles are managed by the admin through API endpoints.
 - Financial records are simple transactions (no currency conversion)

## ⚙️ Setup Instructions

  ### 1. Clone the repository
 - git clone https://github.com/HARISH-1316/Finlytics-Finance-Analytics-Dashboard.git
   
  ### 2. Navigate to project
 - cd finlytics
   
  ### 3. Install dependencies
 - npm install
   
  ### 4. Configure environment variables
 - Create a .env file in the root directory and add:
 - Code:  
  PORT=3000  
  MONGO_URI=your_mongodb_connection  
  JWT_SECRET=your_secret_key  
  
  ### 5. Start the server
 - node server.js
 - nodemon server.js (for this you to install nodemon using npm install nodemon)
   
  ### 6. Server will run on
 - http://localhost:3000

## ⚖️ Technical Decisions & Trade-offs
  -  JWT Authentication
  - MongoDB with Mongoose
  - Aggregation Pipeline for Analytics
  - Role-Based Access Control (RBAC)
  - MVC-Inspired Structure
  - Joi Validation
  - Centralized Error Handling
  - Environment Variables (.env)

## 🚀 Future Improvements

  - Add frontend (React dashboard UI)
  - Implement pagination and advanced filtering
  - Add export features (CSV/PDF reports)
  - Integrate unit and integration testing
  - Add rate limiting and security enhancements
