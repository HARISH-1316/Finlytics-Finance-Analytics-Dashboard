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
    - Activate/Deactivate users
    - Search users by filters

  - 💰 Records Management (CRUD)
    - Add transactions
    - View records (role-based)
    - Update/Delete records (Admin only)

  - 📊 Dashboard & Analytics
    - Summary of transactions
    - Category-wise breakdown
    - Monthly trends
    - Recent transactions  
    Implemented using MongoDB Aggregation Pipeline.

## 🛠️ Tech Stack
  - Backend: Node.js, Express.js
  - Database: MongoDB (Mongoose)
  - Authentication: JWT, bcrypt
  - Validation: Joi
  - Architecture: MVC - inspired architecture (Models, Controllers, Routes)
  - Error Handling: Custom middleware (ExpressError, wrapAsync)

## 🔑 API Endpoints

  - 🔐 Auth Routes
    - POST   /auth/signup&nbsp;&nbsp;&nbsp;→ Register user
    - POST   /auth/login&nbsp;&nbsp;&nbsp;→ Login & get JWT
    - GET    /auth/me&nbsp;&nbsp;&nbsp;→ Get current user
    - PATCH  /auth/:id/status&nbsp;&nbsp;&nbsp;→ Toggle user status (Admin)
    - PATCH  /auth/:id/role&nbsp;&nbsp;&nbsp;→ Change user role (Admin)
    - GET    /auth/search&nbsp;&nbsp;&nbsp;→ Search users (Admin, Analyst)

  - 📁 Records Routes
    - GET    /records&nbsp;&nbsp;&nbsp;→ Get records (role-based)
    - GET    /records/user/:id&nbsp;&nbsp;&nbsp;→ Get records by user (Admin, Analyst)
    - GET    /records/search&nbsp;&nbsp;&nbsp;→ Search records
    - GET    /records/:id&nbsp;&nbsp;&nbsp;→ Get single record
    - POST   /records&nbsp;&nbsp;&nbsp;→ Create record
    - PUT    /records/:id&nbsp;&nbsp;&nbsp;→ Update record (Admin)
    - DELETE /records/:id&nbsp;&nbsp;&nbsp;→ Delete record (Admin)

  - 📊 Dashboard Routes
    - GET /dashboard/summary &nbsp;&nbsp;&nbsp;    → Financial summary
    - GET /dashboard/category &nbsp;&nbsp;&nbsp;   → Category-wise breakdown
    - GET /dashboard/recent    &nbsp;&nbsp;&nbsp;  → Recent transactions
    - GET /dashboard/trends  &nbsp;&nbsp;&nbsp;    → Monthly trends

## ⚠️ Assumption
 - A default admin user is pre-created, and all user roles are managed by the admin through API endpoints.

## ⚙️ Setup Instructions

  ### 1. Clone the repository
 - git clone https://github.com/your-username/finlytics.git
   
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
 - nodemon server.js (for this you to install nodemon using npm i nodemon)
   
  ### 6. Server will run on
 - http://localhost:3000

