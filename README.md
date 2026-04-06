# Finlytics
A role-based Finance Dashboard Backend API built using Node.js, Express, MongoDB, and Mongoose, featuring secure authentication, robust authorization, dynamic analytics using aggregation and secure CRUD operations.

🚀 Features
1) 🔐 Authentication & Security
  ->User authentication using JWT (JSON Web Token)
  ->Password hashing using bcrypt
  ->Environment variables managed using .env
  ->Input validation using Joi
  ->Centralized error handling using custom middleware

2) 👥 Role-Based Access Control
    There are 3 types of users:
    Role	    Permissions
    Viewer  ->Access only their own records & dashboard
    Analyst ->Access all records & analytics
    Admin   ->Full control (users + records + roles)

3) 📁 Core Functionalities
  ✅ User Management
     ->Signup & Login
     ->Role assignment (Admin only)
     ->Activate/Deactivate users
     ->Search users by filters
  💰 Records Management (CRUD)
     ->Add transactions
     ->View records (role-based)
     ->Update/Delete records (Admin only)
  📊 Dashboard & Analytics
     ->Summary of transactions
     ->Category-wise breakdown
     ->Monthly trends
     ->Recent transactions
      Implemented using MongoDB Aggregation Pipeline.

4) 🛠️ Tech Stack
   ->Backend: Node.js, Express.js
   ->Database: MongoDB (Mongoose)
   ->Authentication: JWT, bcrypt
   ->Validation: Joi
   ->Architecture: MVC Pattern
   ->Error Handling: Custom middleware (ExpressError, wrapAsync)

🔑 API Endpoints
  🔐 Auth Routes
   ->POST   /auth/signup           → Register user
   ->POST   /auth/login            → Login & get JWT
   ->GET    /auth/me               → Get current user
   ->PATCH  /auth/:id/status       → Toggle user status (Admin)
   ->PATCH  /auth/:id/role         → Change user role (Admin)
   ->GET    /auth/search           → Search users (Admin, Analyst)
  📁 Records Routes
   ->GET    /records               → Get records (role-based)
   ->GET    /records/user/:id      → Get records by user (Admin, Analyst)
   ->GET    /records/search        → Search records
   ->GET    /records/:id           → Get single record
   ->POST   /records               → Create record
   ->PUT    /records/:id           → Update record (Admin)
   ->DELETE /records/:id           → Delete record (Admin)
  📊 Dashboard Routes
   ->GET /dashboard/summary        → Financial summary
   ->GET /dashboard/category       → Category-wise breakdown
   ->GET /dashboard/recent         → Recent transactions
   ->GET /dashboard/trends         → Monthly trends

