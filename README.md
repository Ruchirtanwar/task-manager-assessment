# Task Manager Assessment

A full-stack task management web application built using the MERN stack. Users can register, verify email, log in, manage tasks, set priorities, and track task completion.

---
# Live Demo

## Frontend
[https://your-frontend-url.vercel.app](https://task-manager-assessment-frontend-ten.vercel.app/)

## Backend API
[https://your-backend-url.onrender.com](https://task-manager-assessment-backend-mu.vercel.app/)

---

# Features

- User Authentication
- JWT Authorization
- Email Verification
- Forgot Password / Reset Password
- Task CRUD Operations
- Task Priorities
- Due Dates
- Responsive Dashboard
- Protected Routes
- RESTful API Architecture

---

# Tech Stack

## Frontend
- React.js
- React Router DOM
- Axios
- Tailwind CSS

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Nodemailer

---

# Folder Structure

```bash
backend/
frontend/
```

---

# Environment Variables

## Backend

Create a `.env` file inside `backend/`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

CLIENT_URL=http://localhost:5173
```

## Frontend

Create a `.env` file inside `frontend/`

```env
VITE_API_URL=http://localhost:5000/api
```

---

# Installation & Setup

## Clone Repository

```bash
git clone https://github.com/yourusername/task-manager-assessment.git
```

---

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# API Endpoints

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | Login User |
| POST | /api/auth/forgot-password | Forgot Password |
| POST | /api/auth/reset-password/:token | Reset Password |

---

## Tasks

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/tasks | Get All Tasks |
| POST | /api/tasks | Create Task |
| PUT | /api/tasks/:id | Update Task |
| DELETE | /api/tasks/:id | Delete Task |

---

# Architecture Decisions

The application follows a MERN stack architecture with separate frontend and backend services. JWT-based authentication is used for secure protected routes. MongoDB is used for storing user and task data. React Context API manages frontend global state, while Axios handles communication with REST APIs.

The project structure separates concerns clearly between routes, controllers, middleware, models, and frontend UI components for maintainability and scalability.

---

# Future Improvements

- Task Tags
- Subtasks
- Drag & Drop Task Management
- Notifications
- Docker Support

---

# Author

Ruchir Tanwar
