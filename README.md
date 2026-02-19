🎓 School ERP System

A Complete MERN Stack Based School Management Solution

The School ERP System is a full-stack web application designed to digitize and automate school administrative and academic processes. It provides role-based dashboards for Admin, Teachers, and Students, enabling centralized management of academic records, attendance, fees, timetable, library, and more.

📌 Table of Contents

Project Overview

System Architecture

Core Modules

Technology Stack

Folder Structure

Installation Guide

Environment Variables

API Overview

Authentication & Authorization

Database Design

Screenshots

Future Enhancements

Contributing

License

📖 Project Overview

Managing school operations manually is time-consuming and error-prone. This ERP system centralizes all major operations into a single platform:

Student Information Management

Teacher Management

Attendance Tracking

Fee & Invoice Management

Timetable Management

Library Management

Assignment & Study Material Upload

Role-Based Secure Access

The system ensures:

Data consistency

Secure authentication

Scalable backend architecture

Responsive user interface

🏗 System Architecture
Frontend (React)
        ↓
REST API (Express.js)
        ↓
MongoDB Database

Frontend communicates with backend using Axios

Backend handles business logic & authentication

MongoDB stores user, academic & transactional data

JWT used for secure API access

📦 Core Modules
👨‍💼 Admin Panel

Admin has complete system control:

Add / Update / Delete:

Students

Teachers

Classes

Subjects

Generate Fee Structures & Invoices

Assign Teachers to Subjects

Manage Timetable

Library Book & Copy Management

Monitor system data

👨‍🏫 Teacher Panel

Teachers can:

View assigned classes

Mark attendance

Upload study materials

Upload assignments

Manage student academic records

View timetable

👩‍🎓 Student Panel

Students can:

View attendance records

View fee invoices

Download study materials

Submit assignments

View timetable

View issued library books

💰 Fee Management System

Quarterly fee generation

Academic year-based billing

Due date tracking

Invoice generation per class

Payment status tracking

📚 Library Management

Book management

Unique copy generation

Issue & return tracking

Student-wise issued book records

🗓 Timetable Management

Class-based scheduling

Subject-teacher allocation

Conflict prevention logic

🛠 Technology Stack
🔹 Frontend

React.js

Axios

React Hooks

Context API / Local Storage

CSS / Bootstrap

🔹 Backend

Node.js

Express.js

Mongoose

JWT Authentication

Async/Await Error Handling

🔹 Database

MongoDB

🔹 Dev Tools

Nodemon

Postman

Git & GitHub

📂 Folder Structure
School-ERP-System/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── app.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.js
│   └── package.json
│
└── README.md
⚙ Installation Guide
1️⃣ Clone Repository
git clone https://github.com/abhishekguptaji/School-ERP-System.git
cd School-ERP-System
2️⃣ Backend Setup
cd backend
npm install

Create a .env file inside backend:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Start backend server:

npm run dev

Server runs on:

http://localhost:5000
3️⃣ Frontend Setup
cd frontend
npm install
npm start

Frontend runs on:

http://localhost:3000
🔐 Authentication & Authorization

JWT Token based authentication

Role stored in token payload

Middleware verifies:

Token validity

Role-based route access

Roles:

ADMIN

TEACHER

STUDENT

Protected routes use middleware for security.

🌐 API Overview

Example API endpoints:

Auth
POST /api/v1/auth/login
POST /api/v1/auth/register
Student
GET /api/v1/student/profile
GET /api/v1/student/attendance
Admin
POST /api/v1/admin/create-student
POST /api/v1/admin/generate-fee
Library
POST /api/v1/admin/book
POST /api/v1/admin/copy/:id/issue
🗄 Database Design

Main Collections:

Users

Students

Teachers

Classes

Subjects

Attendance

FeeStructure

FeeInvoice

LibraryBook

LibraryBookCopy

StudyMaterial

Assignment

Relational references handled using:

mongoose.Schema.Types.ObjectId
🚀 Future Enhancements

Online fee payment gateway

SMS / Email notifications

Report generation (PDF export)

Analytics dashboard

Parent portal

Multi-school support

Deployment on AWS / Render / Vercel

🤝 Contributing

Fork the repository

Create feature branch

Commit changes

Push branch

Open Pull Request

📄 License

This project is licensed under the MIT License.

👨‍💻 Author

Abhishek Gupta
B.Tech Student | Full Stack Developer
GitHub: https://github.com/abhishekguptaji

If you want, I can now:

🔥 Make it more recruiter-friendly

📈 Optimize it for GitHub portfolio impact

🏢 Make it startup-level professional

📊 Add architecture diagram image

🐳 Add Docker deployment guide

☁ Add production deployment steps

Just tell me what level you want 🚀
