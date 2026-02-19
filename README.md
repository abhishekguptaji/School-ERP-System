# 🎓 School ERP System

A **Full Stack School Enterprise Resource Planning (ERP) System** designed to digitally manage and automate academic and administrative operations in schools. The application supports **role-based access control** for Admin, Teacher, and Student users, allowing secure, scalable, and modular handling of school data and processes.:contentReference[oaicite:1]{index=1}

---

##  Project Overview

School ERP System is a web-based application that replaces manual school management processes with a modern digital platform. It centralizes and automates key operations such as:

✔ User management (Admin, Teacher, Student)  
✔ Secure authentication and role-based authorization  
✔ Academic data handling  
✔ Modular frontend and backend architecture  
✔ REST API driven backend  
✔ Scalable and extendable structure

This system is ideal for academic institutions looking to reduce paperwork, improve efficiency, and maintain accurate records.:contentReference[oaicite:2]{index=2}

---

##  User Roles & Access

| Role     | Capabilities |
|----------|--------------|
| **Admin**    | Manage students, teachers, classes, subjects, and system settings |
| **Teacher**  | View assigned classes and students |
| **Student**  | View personal academic and profile information |

Each role has specific privileges enforced through server-side **JWT authentication** and middleware checks.:contentReference[oaicite:3]{index=3}

---

##  Tech Stack

**Frontend:** React (HTML, CSS, JavaScript UI)  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**API:** RESTful Endpoints  
**Authentication:** JWT Token Authentication  
**Architecture:** Client ⇄ Server ⇄ Database:contentReference

---

## 🗂 Folder Structure
School-ERP-System/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── config/
│ └── server.js
├── frontend/
│ ├── components/
│ ├── pages/
│ ├── services/
│ └── App.js
├── .gitignore
├── LICENSE
└── README.md

:contentReference[oaicite:5]{index=5}

---

## Features

### 📌 Authentication
- Secure login for all roles using JWT
- Password hashing  
- Role-based access control

###  Admin Dashboard
- Create, view, edit, delete users like students and Teacher
- Grievance Panel handle for the students
- Create Fee for the Students in the Quateraly basis  
- Assign classes and subjects
- Create Notice for the Students , Teacher and All.
- Show the necessary details are in the like all student, teacher and attendece details and the failure of the students.   
- Assign Fee For Classes and subjects,teachers notice.   

### Teacher Panel
- View assigned classes
- See student lists and details.
- Add Assignment and Study Material.
- ClassTeacher uploaded for the students of their class.
- ClassTeacher accepted the student Request for the leave if the leave is more than 1 to 2 days forward to the admin..
- And Many more...................................................

### 📌 Student Panel
- Profile & academic info
- Dashboard for class schedules

> ⚠ Modules like attendance, timetable, fee management, and notifications are **planned for future enhancements** 

---

## 🛠 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/abhishekguptaji/School-ERP-System.git
cd School-ERP-System
cd backend
npm install

### Create a .env file with:
PORT=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
MONGODB_URI=
CORS_ORIGIN=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_EXPIRY=

Start backend:
npm run dev

Frontend Setup:
cd ../frontend
npm install
npm run dev

Open your browser at: At the give link---

### API Reference (Examples)
Method	Endpoint	Description
POST	/api/auth/login	User login
POST	/api/auth/register	Register user
GET	/api/users	Get all users
POST	/api/students	Create student
POST	/api/teachers	Create teacher

Authentication is implemented using JWT tokens and appropriate protected routes.

Future Enhancements

The project is already modular and scalable — here are logical improvements:

✔ Fee & Invoice System
✔ Timetable Scheduler
✔ Email & SMS Notifications
✔ Cloud Deployment (AWS / Vercel / Render)
✔ Responsive UI Updates
✔ Documentation & API Versioning

Contributing
Contributions are welcome!
Fork repository
Create a new branch
git checkout -b feature/your-feature-name
git commit -m "Add new feature"
git push origin feature/your-feature-name

License
This project is released under the MIT License — see the LICENSE file for details
