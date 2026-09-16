# 🎓 SDMS – Student Data Management System

A full-stack, role-based academic management application engineered for educational institutions (schools, colleges, and universities) to streamline user administration, attendance tracking, examination results management, and real-time analytical reporting.

---

## 📋 Table of Contents
- [ Overview](#-overview)
- [🌐 Live Demo](#-live-demo)
- [⚡ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [💻 Tech Stack](#-tech-stack)
- [📂 Folder Structure](#-folder-structure)
- [🔐 Roles & Permissions](#-roles--permissions)
- [⚙️ How It Works](#️-how-it-works)
- [🔑 Authentication](#-authentication)
- [🧩 Modules Explained](#-modules-explained)
- [📡 API Reference](#-api-reference)
- [🗄️ Database Schema](#️-database-schema)
- [🆔 ID Format Rules](#-id-format-rules)
- [🚀 Installation](#-installation)
- [🌱 Seed Data & Default Credentials](#-seed-data--default-credentials)
- [🔑 Environment Variables](#-environment-variables)
- [🎯 Usage](#-usage)
- [🌐 Deployment](#-deployment)
- [📱 Mobile Build (Capacitor)](#-mobile-build-capacitor)
- [🛠️ Troubleshooting](#️-troubleshooting)
- [🛡️ Security Notes](#️-security-notes)
- [🔮 Future Improvements](#-future-improvements)
- [📜 License](#-license)
- [👤 Author](#-author)

---

## 🌟 Overview

**SDMS (Student Data Management System)** provides a centralized web and mobile platform for managing campus operations efficiently. It solves common administrative bottlenecks in academic institutions—such as fragmented record keeping, manual attendance logs, delayed result declarations, and opaque authorization structures.

### Target Users & Problem Solved
- **Administrators**: Eliminate manual record updates and gain bird's-eye visibility into institutional stats (student distribution, faculty load, attendance ratios, academic performance trends).
- **Faculty Members**: Fast-track daily classroom management with streamlined digital attendance recording and automated grade sheet submission.
- **Students**: Instantly access attendance records, subject-wise result breakdowns, and personal academic progress through an intuitive, self-service dashboard.

---

## 🌐 Live Demo

- **Frontend App (Netlify)**: [https://sdmsapp.netlify.app](https://sdmsapp.netlify.app)
- **Backend API (Render)**: [https://sdms-backend-lfqn.onrender.com](https://sdms-backend-lfqn.onrender.com)
- **Firebase Project ID**: `sdms-ecd62`

---

## ⚡ Features

| Role | Key Features & Capabilities |
| :--- | :--- |
| **Super Admin** | • Full system administration & governance<br>• Create, edit, block, unblock, and manage Admin accounts<br>• Manage Faculty, Student, and Subject directories<br>• View system-wide analytical reports & audit logs<br>• Export attendance & performance data in CSV format |
| **Admin** | • Manage Faculty and Student accounts (create, view, update, block/unblock)<br>• Manage Subject directory<br>• Access institutional performance, attendance, and registration analytics<br>• Export academic reports to CSV |
| **Faculty** | • Record daily student attendance per subject<br>• Upload and update student exam marks & grades<br>• View assigned subject lists and student class rosters |
| **Student** | • View personal profile and academic enrollment details<br>• Monitor subject-wise attendance percentages & status<br>• View term examination scores and performance metrics |

---

## 🏗️ Architecture

```
+-----------------------------------------------------------------------+
|                              CLIENT LAYER                             |
|                                                                       |
|   +---------------------------------+   +-------------------------+   |
|   |   Web Client (React 18 + Vite)  |   | Mobile App (Capacitor)  |   |
|   |    TailwindCSS / Framer Motion  |   |    Android Build APK    |   |
|   +---------------------------------+   +-------------------------+   |
+-----------------------------------||----------------------------------+
                                    || HTTP / REST APIs
                                    \/
+-----------------------------------------------------------------------+
|                             SECURITY LAYER                            |
|                                                                       |
|                     Firebase Authentication (Google)                  |
+-----------------------------------||----------------------------------+
                                    || ID Token / Bearer Header
                                    \/
+-----------------------------------------------------------------------+
|                            BACKEND API LAYER                          |
|                                                                       |
|                        Flask (Python 3.10) + Gunicorn                 |
|             (Auth Middleware, Validators, Blueprints, REST)           |
+-----------------------------------||----------------------------------+
                                    || SQLAlchemy ORM
                                    \/
+-----------------------------------------------------------------------+
|                            DATABASE LAYER                             |
|                                                                       |
|             SQLite (Development) / PostgreSQL (Production)             |
+-----------------------------------------------------------------------+
```

---

## 💻 Tech Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Core** | React | `^18.2.0` | UI Component Framework |
| **Build Tool** | Vite | `^5.0.0` | Lightning-fast frontend build tooling |
| **Styling** | TailwindCSS | `^3.4.0` | Utility-first responsive styling |
| **Animations** | Framer Motion | `^10.16.0` | Fluid UI transitions and micro-interactions |
| **Data Viz** | Recharts | `^2.10.0` | Interactive analytical charts & graphs |
| **Icons** | Lucide React | `^0.300.0` | Clean, modern iconography |
| **UI Toasts** | react-hot-toast | `^2.4.1` | Non-intrusive notification feedback |
| **Backend Core** | Flask | `^3.0.0` | Lightweight RESTful Python web framework |
| **WSGI Server** | Gunicorn | `^21.2.0` | Production-grade HTTP application server |
| **ORM** | SQLAlchemy | `^2.0.0` | Database abstraction & SQL object mapping |
| **Database (Dev)**| SQLite 3 | Embedded | Local zero-config relational storage |
| **Database (Prod)**| PostgreSQL | `14+` | Relational production persistence via `DATABASE_URL` |
| **Auth Engine** | Firebase Auth | `^10.0.0` | Google OAuth 2.0 & Firebase ID Token verification |
| **Password Hashing**| bcrypt | `^4.0.0` | Secure DOB/password hash & salt generator |
| **Mobile Runtime**| Capacitor | `^8.0.0` | Cross-platform Android wrapper |
| **Deployment** | Render & Netlify| Hosted | Cloud API hosting (Render) & CDN UI deployment (Netlify)|

---

## 📂 Folder Structure

```
SDMS/
├── backend/
│   ├── app.py                      # Flask application entry point & CORS initialization
│   ├── config.py                   # App configuration & env setup (SQLite / Postgres)
│   ├── Procfile                    # Deployment process configuration for Render (Gunicorn)
│   ├── requirements.txt            # Python backend dependencies
│   ├── .env.example                # Template for backend environment variables
│   ├── database/
│   │   ├── connection.py           # Database engine & session maker
│   │   ├── schema.sql              # Raw DDL database table creation script
│   │   ├── seed.py                 # Python database seeder script
│   │   └── seed.sql                # Default initial SQL records (Super Admin, Faculty, Student)
│   ├── firebase/
│   │   ├── auth.py                 # Firebase Admin SDK initialization & token verifier
│   │   └── serviceAccountKey.json  # Firebase private service credentials (git-ignored)
│   ├── models/
│   │   └── models.py               # SQLAlchemy ORM Data Models (Admin, Faculty, Student, etc.)
│   ├── routes/
│   │   ├── admin.py                # Admin endpoints (faculty/student/subject CRUD, block, reports)
│   │   ├── auth.py                 # Auth endpoints (login, Firebase validation, credentials)
│   │   ├── dashboard.py            # Aggregated statistics endpoints per role
│   │   ├── faculty.py              # Faculty endpoints (attendance & marks upload)
│   │   └── student.py              # Student endpoints (view attendance, profile, results)
│   ├── scripts/
│   │   ├── create_super_admin.py   # CLI script to bootstrap Super Admin account
│   │   └── ensure_admin.py         # Utility script to verify admin presence
│   └── utils/
│       ├── auth_middleware.py      # Decorators (@token_required, @role_required)
│       ├── id_generator.py         # Formatted ID generator (A_###, F_###, S_###)
│       ├── startup_checks.py       # Database & environment readiness checks on boot
│       └── validators.py           # Input validation regex rules & sanitization
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Primary single-page application & routing state
│   │   ├── main.jsx                # React app entry DOM render
│   │   ├── AdminReports.jsx        # Analytics charts & reporting view
│   │   ├── DashboardWidgets.jsx    # Metric cards & stats display components
│   │   ├── OverviewGraph.jsx       # Recharts visualization graphics
│   │   ├── UserManagement.jsx      # Admin table views for managing users
│   │   ├── ThemeContext.jsx        # Light/Dark mode state context
│   │   ├── firebase_config.js      # Client-side Firebase App initialization
│   │   └── styles/
│   │       └── global.css          # Tailwind imports & custom CSS root rules
│   ├── public/                     # Static assets (favicons, icons)
│   ├── capacitor.config.json       # Capacitor mobile bridge configuration
│   ├── vite.config.js              # Vite bundler & dev server config
│   ├── tailwind.config.js          # Tailwind CSS design system rules
│   ├── package.json                # Node dependencies & frontend scripts
│   └── .env.example                # Template for frontend environment variables
│
├── netlify.toml                    # Netlify SPA redirect rules & build settings
├── render.yaml                     # Render Infrastructure-as-Code blueprint
├── .gitignore                      # Git tracking exclusion list
├── LICENSE                         # MIT License file
└── README.md                       # Main repository documentation
```

---

## 🔐 Roles & Permissions

| Role | Allowed Actions (Can Do) | Prohibited Actions (Cannot Do) |
| :--- | :--- | :--- |
| **Super Admin** | • Manage all Admins, Faculty, Students, and Subjects<br>• Block / unblock any Admin, Faculty, or Student<br>• Access full analytics, audit logs, and data exports | • Cannot block self<br>• Cannot block the last remaining active Super Admin |
| **Admin** | • Manage Faculty and Student accounts<br>• Manage Subject listings<br>• View system reports and export CSV summaries<br>• Block / unblock Faculty and Students | • Cannot create, edit, or block Admin accounts<br>• Cannot modify Super Admin settings |
| **Faculty** | • Record and edit student attendance records<br>• Input and update student exam marks<br>• View student rosters in assigned subjects | • Cannot access administrative control panels<br>• Cannot modify student/faculty profiles or subjects |
| **Student** | • View personal profile information<br>• View individual subject attendance records<br>• View personal examination marks & grades | • Cannot modify any database records<br>• Cannot view other students' private data |

---

## ⚙️ How It Works

1. **Authentication Stage**: The user opens the SDMS application and selects a preferred login path:
   - **Credential Login**: Enters assigned Unique ID (`A_001`, `F_001`, `S_001`) and Password (`YYYY-MM-DD` DOB format).
   - **Google OAuth Login**: Signs in via Firebase Google Popup authentication.
2. **Identity & Role Verification**: 
   - The frontend sends the credentials/token to backend endpoints (`/api/auth/login` or `/api/auth/login/credentials`).
   - The Flask API validates credentials using bcrypt or verifies the Firebase ID token.
   - Upon successful verification, the API returns user profile metadata alongside their role (`superadmin`, `admin`, `faculty`, `student`).
3. **Role-Based View Routing**:
   - The React frontend receives the user state and dynamically mounts the appropriate workspace view (`AdminDashboard`, `FacultyDashboard`, or `StudentDashboard`).
4. **Interactive Action Execution**:
   - Depending on granted permissions, API requests carry authentication details to execute actions (e.g., mark attendance, submit marks, export reports).

---

## 🔑 Authentication

SDMS implements a dual authentication scheme to ensure flexibility and security:

```
                      +-----------------------------+
                      |       USER LOGIN PAGE       |
                      +--------------+--------------+
                                     |
               +---------------------+---------------------+
               |                                           |
               v                                           v
    [ Credential Login ]                          [ Google OAuth Login ]
  UID + Password (YYYY-MM-DD)                     Firebase Popup Auth
               |                                           |
               v                                           v
   POST /api/auth/login/credentials               POST /api/auth/login
               |                                           |
    Query DB by User ID                         Verify Token with Firebase
  Verify Hash via bcrypt                            Extract Email & Claims
               |                                           |
               +---------------------+---------------------+
                                     |
                                     v
                        Return JSON Response & Role
               (superadmin / admin / faculty / student)
```

1. **Firebase Authentication (OAuth 2.0)**:
   - Client authenticates directly with Firebase services via Google Sign-In.
   - Client sends the resulting Firebase ID token in the request authorization header to `/api/auth/login`.
   - The backend validates the token using the `firebase-admin` Python SDK.
2. **Credential Login (UID / DOB)**:
   - Users authenticate using standard institutional credentials (e.g., `A_001`, `F_001`, `S_001`).
   - Passwords default to the user's Date of Birth (`YYYY-MM-DD`) and are verified against salted `bcrypt` hashes in the database.

---

## 🧩 Modules Explained

### Frontend Modules (`frontend/src/`)

| File / Component | Purpose & Description |
| :--- | :--- |
| [`App.jsx`](file:///d:/sdms/sdms-main/frontend/src/App.jsx) | Main application root handling state routing, role views, modals, and core layout logic. |
| [`main.jsx`](file:///d:/sdms/sdms-main/frontend/src/main.jsx) | Entry point rendering the React application root into DOM. |
| [`AdminReports.jsx`](file:///d:/sdms/sdms-main/frontend/src/AdminReports.jsx) | Analytics reporting screen displaying charts, filterable data, and CSV download controls. |
| [`DashboardWidgets.jsx`](file:///d:/sdms/sdms-main/frontend/src/DashboardWidgets.jsx) | Modular KPI dashboard metric cards displaying counts, averages, and statistics. |
| [`OverviewGraph.jsx`](file:///d:/sdms/sdms-main/frontend/src/OverviewGraph.jsx) | Graphical chart visualizations utilizing Recharts (Bar, Line, and Pie views). |
| [`UserManagement.jsx`](file:///d:/sdms/sdms-main/frontend/src/UserManagement.jsx) | Tabular management interface for searching, filtering, adding, blocking, and unblocking users. |
| [`ThemeContext.jsx`](file:///d:/sdms/sdms-main/frontend/src/ThemeContext.jsx) | React Context provider managing persistent Light/Dark theme switching across components. |
| [`firebase_config.js`](file:///d:/sdms/sdms-main/frontend/src/firebase_config.js) | Client Firebase SDK initialization script reading environment variables. |

### Backend Modules (`backend/`)

| File / Directory | Purpose & Description |
| :--- | :--- |
| [`app.py`](file:///d:/sdms/sdms-main/backend/app.py) | Application factory initializing Flask app, registering API blueprints, configuring CORS, and mounting root endpoints. |
| [`config.py`](file:///d:/sdms/sdms-main/backend/config.py) | Environment configuration loader establishing DB strings and session secret parameters. |
| [`database/`](file:///d:/sdms/sdms-main/backend/database) | Database connectivity engine (`connection.py`), raw SQL schemas (`schema.sql`), and seed generators (`seed.py`). |
| [`firebase/auth.py`](file:///d:/sdms/sdms-main/backend/firebase/auth.py) | Wrapper around Firebase Admin SDK for decoding and validating ID tokens. |
| [`models/models.py`](file:///d:/sdms/sdms-main/backend/models/models.py) | SQLAlchemy ORM model definitions for Admin, Faculty, Student, Subject, Attendance, Marks, and Audit Log tables. |
| [`routes/auth.py`](file:///d:/sdms/sdms-main/backend/routes/auth.py) | Authentication API endpoints handling token verification and credential login checks. |
| [`routes/admin.py`](file:///d:/sdms/sdms-main/backend/routes/admin.py) | Blueprint managing administrative CRUD operations, user status modifications, and report generation. |
| [`routes/faculty.py`](file:///d:/sdms/sdms-main/backend/routes/faculty.py) | Blueprint providing attendance submission and grade entry features for faculty. |
| [`routes/student.py`](file:///d:/sdms/sdms-main/backend/routes/student.py) | Blueprint serving student profile views, attendance histories, and academic mark sheets. |
| [`routes/dashboard.py`](file:///d:/sdms/sdms-main/backend/routes/dashboard.py) | Blueprint calculating real-time aggregated dashboard telemetry for all user roles. |
| [`utils/auth_middleware.py`](file:///d:/sdms/sdms-main/backend/utils/auth_middleware.py) | Custom decorators (`@token_required`, `@role_required`) enforcing authorization logic. |

---

## 📡 API Reference

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Access Level | Request Payload | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | `{ "token": "<firebase_id_token>" }` | Verifies Firebase ID token and returns user details & role. |
| `POST` | `/api/auth/login/credentials` | Public | `{ "username": "A_001", "password": "..." }` | Authenticates user via UID and hashed DOB password. |

### 🛠️ Admin Management (`/api/admin`)

| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/faculty` | Token + Admin | Fetch complete list of faculty records. |
| `POST` | `/api/admin/faculty` | Token + Admin | Create a new faculty member record. |
| `PUT` | `/api/admin/faculty/<uid>` | Token + Admin | Update existing faculty profile details. |
| `DELETE` | `/api/admin/faculty/<uid>` | Token + Admin | Delete a faculty record from system. |
| `GET` | `/api/admin/students` | Token + Admin | Fetch complete list of student records. |
| `POST` | `/api/admin/students` | Token + Admin | Create a new student record. |
| `PUT` | `/api/admin/students/<uid>` | Token + Admin | Update existing student record. |
| `DELETE` | `/api/admin/students/<uid>` | Token + Admin | Delete a student record. |
| `GET` | `/api/admin/admins` | Token + Super Admin | List all registered administrator accounts. |
| `POST` | `/api/admin/admins` | Token + Super Admin | Create a new Administrator account. |
| `PUT` | `/api/admin/admins/<uid>` | Token + Super Admin | Modify Administrator account status/details. |
| `GET` | `/api/admin/subjects` | Token + Admin | Fetch all registered academic subjects. |
| `POST` | `/api/admin/subjects` | Token + Admin | Add a new subject to curriculum catalog. |
| `GET` | `/api/admin/reports/attendance` | Token + Admin | Get institutional aggregate attendance reports. |
| `GET` | `/api/admin/reports/performance` | Token + Admin | Get academic marks performance distributions. |
| `GET` | `/api/admin/reports/registrations` | Token + Admin | Get student and faculty registration trends over time. |
| `GET` | `/api/admin/reports/export/<type>` | Public | Export system report (`attendance`/`performance`) as downloadable CSV. |
| `GET` | `/api/admin/reports/charts` | Token + Admin | Retrieve aggregated graph data for frontend chart views. |
| `GET` | `/api/admin/users/<role>` | Token + Admin | List users filtered by role (`admin`, `faculty`, `student`). |
| `POST` | `/api/admin/users/<role>/<uid>/block` | Token + Admin | Block a target user account with reason and timestamp. |
| `POST` | `/api/admin/users/<role>/<uid>/unblock` | Token + Admin | Restore access to a previously blocked user account. |

### 👩‍🏫 Faculty Portal (`/api/faculty`)

| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/faculty/attendance` | Unprotected | Submit student class attendance batch entries. |
| `GET` | `/api/faculty/attendance` | Unprotected | Retrieve submitted attendance records for assigned subject. |
| `POST` | `/api/faculty/results` | Unprotected | Upload student examination scores and marks. |

### 🎓 Student Portal (`/api/student`)

| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/student/<uid>/profile` | Unprotected | Fetch student personal profile details. |
| `GET` | `/api/student/<uid>/attendance` | Unprotected | Retrieve individual attendance records & calculated percentages. |
| `GET` | `/api/student/<uid>/results` | Unprotected | Fetch subject-wise examination performance results. |

### 📊 Dashboard Telemetry (`/api/dashboard`)

| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/admin/stats` | Unprotected | Get total student/faculty counts, average attendance, and metrics. |
| `GET` | `/api/dashboard/faculty/<uid>/stats` | Unprotected | Get assigned class metrics, pending marks count, and subject list. |
| `GET` | `/api/dashboard/student/<uid>/stats` | Unprotected | Get student's overall attendance % and GPA/mark average summary. |

### 💓 System Health (`/`)

| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | Returns API status check string ("SDMS Backend API Running"). |

---

## 🗄️ Database Schema

The SDMS database consists of **7 relational tables**:

```
+------------------+       +------------------+       +------------------+
|      admin       |       |     faculty      |       |     student      |
+------------------+       +------------------+       +------------------+
| u_id (PK)        |       | u_id (PK)        |       | u_id (PK)        |
| name             |       | name             |       | name             |
| admin_type (ENUM)|       | email (UNIQUE)   |       | email (UNIQUE)   |
| email (UNIQUE)   |       | phone            |       | phone            |
| phone            |       | dob              |       | dob              |
| dob              |       | password         |       | password         |
| password         |       | status           |       | created_at       |
| status           |       | blocked_by       |       | status           |
| blocked_by       |       | blocked_reason   |       | blocked_by       |
| blocked_reason   |       | blocked_at       |       | blocked_reason   |
| blocked_at       |       | unblock_at       |       | blocked_at       |
| unblock_at       |       +--------+---------+       | unblock_at       |
+------------------+                |                 +--------+---------+
                                    |                          |
                                    +------------+-------------+
                                                 |
                                                 v
+------------------+       +---------------------------------------------+
|     subject      |       |                    marks                    |
+------------------+       +---------------------------------------------+
| subject_id (PK)  |<------| id (PK), student_id (FK), faculty_id (FK)   |
| subject_name     |       | subject_id (FK), marks_obtained, max_marks  |
+------------------+       +---------------------------------------------+
         ^                                       ^
         |                 +---------------------+-----------------------+
         |                 |                  attendance                 |
         |                 +---------------------------------------------+
         +-----------------| id (PK), student_id (FK), faculty_id (FK)   |
                           | subject_id (FK), date, status               |
                           +---------------------------------------------+

                           +---------------------------------------------+
                           |                  audit_log                  |
                           +---------------------------------------------+
                           | id (PK), actor_id, target_id, action        |
                           | reason, timestamp                           |
                           +---------------------------------------------+
```

### Table Definitions

1. `admin`
   - `u_id` (VARCHAR(10), Primary Key) — Formatted ID (e.g., `A_001`)
   - `name` (VARCHAR(100), NOT NULL) — Full Name
   - `admin_type` (VARCHAR(20), NOT NULL) — Type: `'super'` or `'normal'`
   - `email` (VARCHAR(100), UNIQUE) — Email address
   - `phone` (VARCHAR(20)) — Contact phone number
   - `dob` (DATE) — Date of Birth
   - `password` (VARCHAR(255)) — Bcrypt hashed password
   - `status` (VARCHAR(20), DEFAULT `'active'`) — Account status (`'active'`, `'blocked'`)
   - `blocked_by` (VARCHAR(10)) — Actor ID who issued block
   - `blocked_reason` (TEXT) — Reason for suspension
   - `blocked_at` (TIMESTAMP) — Date/time block was applied
   - `unblock_at` (TIMESTAMP) — Date/time scheduled unblock
2. `faculty`
   - `u_id` (VARCHAR(10), Primary Key) — Formatted ID (e.g., `F_001`)
   - `name` (VARCHAR(100), NOT NULL) — Full Name
   - `email` (VARCHAR(100), UNIQUE) — Email address
   - `phone` (VARCHAR(20)) — Contact phone number
   - `dob` (DATE) — Date of Birth
   - `password` (VARCHAR(255)) — Bcrypt hashed password
   - `status` (VARCHAR(20), DEFAULT `'active'`) — Account status
   - `blocked_by`, `blocked_reason`, `blocked_at`, `unblock_at`
3. `student`
   - `u_id` (VARCHAR(10), Primary Key) — Formatted ID (e.g., `S_001`)
   - `name` (VARCHAR(100), NOT NULL) — Full Name
   - `email` (VARCHAR(100), UNIQUE) — Email address
   - `phone` (VARCHAR(20)) — Contact phone number
   - `dob` (DATE) — Date of Birth
   - `password` (VARCHAR(255)) — Bcrypt hashed password
   - `created_at` (TIMESTAMP, DEFAULT `CURRENT_TIMESTAMP`) — Registration date
   - `status`, `blocked_by`, `blocked_reason`, `blocked_at`, `unblock_at`
4. `subject`
   - `subject_id` (INTEGER, Primary Key AUTOINCREMENT) — Unique ID
   - `subject_name` (VARCHAR(100), UNIQUE, NOT NULL) — Subject Name (e.g., Mathematics)
5. `marks`
   - `id` (INTEGER, Primary Key AUTOINCREMENT)
   - `student_id` (VARCHAR(10), Foreign Key -> `student.u_id`)
   - `faculty_id` (VARCHAR(10), Foreign Key -> `faculty.u_id`)
   - `subject_id` (INTEGER, Foreign Key -> `subject.subject_id`)
   - `marks_obtained` (FLOAT, NOT NULL)
   - `max_marks` (FLOAT, DEFAULT 100.0)
6. `attendance`
   - `id` (INTEGER, Primary Key AUTOINCREMENT)
   - `student_id` (VARCHAR(10), Foreign Key -> `student.u_id`)
   - `faculty_id` (VARCHAR(10), Foreign Key -> `faculty.u_id`)
   - `subject_id` (INTEGER, Foreign Key -> `subject.subject_id`)
   - `date` (DATE, NOT NULL) — Attendance date
   - `status` (VARCHAR(10), NOT NULL) — `'Present'`, `'Absent'`, or `'Late'`
7. `audit_log`
   - `id` (INTEGER, Primary Key AUTOINCREMENT)
   - `actor_id` (VARCHAR(10), NOT NULL) — ID of user taking action
   - `target_id` (VARCHAR(10)) — ID of impacted target entity
   - `action` (VARCHAR(100), NOT NULL) — Action description (e.g., `BLOCK_USER`)
   - `reason` (TEXT) — Contextual reason for audit logging
   - `timestamp` (TIMESTAMP, DEFAULT `CURRENT_TIMESTAMP`)

---

## 🆔 ID Format Rules

User accounts follow a standardized structural regex rule:

| User Role | Format Pattern | Regex Rule | Example ID |
| :--- | :--- | :--- | :--- |
| **Administrator** | `A_###` | `^A_\d{3}$` | `A_001` |
| **Faculty Member** | `F_###` | `^F_\d{3}$` | `F_001` |
| **Student** | `S_###` | `^S_\d{3}$` | `S_001` |

> **Password Format**: Initial accounts are assigned a default password corresponding to their **Date of Birth** in `YYYY-MM-DD` string format (e.g., `2005-09-25`), hashed securely via `bcrypt`.

---

## 🚀 Installation

### Prerequisites
- **Python 3.10+** installed locally
- **Node.js 18+** and `npm` installed locally
- **Git** version control tool

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment configuration
cp .env.example .env

# Run database seeder
python database/seed.py

# Start Flask local server
python app.py
```
The Flask server will launch on `http://127.0.0.1:5000`.

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node modules
npm install

# Setup environment configuration
cp .env.example .env

# Start Vite development server
npm run dev
```
The frontend dev server will launch on `http://localhost:5173`.

---

## 🌱 Seed Data & Default Credentials

Use the following initial seeded credentials to log in during local testing or demo evaluation:

| Role | User ID | Default Password (DOB) | Registered Email |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `A_001` | `2005-09-25` | `Piyushchaurasiya348@gmail.com` |
| **Faculty** | `F_001` | `1985-05-20` | `faculty@school.edu` |
| **Student** | `S_001` | `2005-08-15` | `student@school.edu` |

---

## 🔑 Environment Variables

### Backend Environment Variables (`backend/.env`)

| Variable | Description | Required | Default / Value |
| :--- | :--- | :--- | :--- |
| `SECRET_KEY` | Secret key used for session signing | Optional | `dev-secret-key-sdms` |
| `DATABASE_URL` | PostgreSQL connection string for production | Optional | `sqlite:///database/sdms.sqlite3` |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Raw JSON string or path to Firebase Service Account Key | Required in Prod | Base64 or JSON string |

### Frontend Environment Variables (`frontend/.env`)

| Variable | Description | Value Example |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | URL targeting backend API server | `http://localhost:5000` or Render URL |
| `VITE_FIREBASE_API_KEY` | Web API key for Firebase project | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Authentication domain | `sdms-ecd62.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project identifier | `sdms-ecd62` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Cloud Storage bucket | `sdms-ecd62.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID`| Firebase messaging sender ID | `1234567890` |
| `VITE_FIREBASE_APP_ID` | Firebase Web App App ID | `1:1234567890:web:...` |
| `VITE_FIREBASE_MEASUREMENT_ID` | Google Analytics ID (optional) | `G-XXXXXXXXXX` |

---

## 🎯 Usage

1. **Accessing the Portal**: Open [https://sdmsapp.netlify.app](https://sdmsapp.netlify.app) or your local URL (`http://localhost:5173`).
2. **Super Admin Operations**:
   - Log in with `A_001` / `2005-09-25`.
   - Add new Administrators, create Faculty and Student accounts.
   - Access **Admin Reports** to view graphical analytics and download CSV data exports.
   - Use **User Management** to search, block, or unblock accounts.
3. **Faculty Operations**:
   - Log in with `F_001` / `1985-05-20`.
   - Select an assigned subject and submit daily class attendance for students.
   - Enter student exam scores under results submission.
4. **Student Operations**:
   - Log in with `S_001` / `2005-08-15`.
   - Inspect overall attendance percentages per subject.
   - Review grade sheets for enrolled courses.

---

## 🌐 Deployment

### 1. Backend Deployment (Render)
1. Link your GitHub repository to [Render](https://render.com).
2. Create a **Web Service** connected to the `backend/` directory.
3. Set **Runtime** to `Python 3`.
4. Set **Build Command**: `pip install -r requirements.txt`.
5. Set **Start Command**: `gunicorn app:app`.
6. Configure environment variables (`SECRET_KEY`, `DATABASE_URL`, `FIREBASE_SERVICE_ACCOUNT_JSON`).

### 2. Frontend Deployment (Netlify)
1. Create a new site on [Netlify](https://netlify.com) connected to the repository.
2. Set **Base directory**: `frontend`.
3. Set **Build command**: `npm run build`.
4. Set **Publish directory**: `frontend/dist`.
5. Configure environment variables starting with `VITE_` matching your Firebase project and Render backend URL.

---

## 📱 Mobile Build (Capacitor)

SDMS can be packaged into a native Android APK using **Capacitor 8**.

```bash
# Navigate to frontend directory
cd frontend

# Build web distribution assets
npm run build

# Copy build files into native Android container
npx cap copy android

# Sync Capacitor plugins
npx cap sync android

# Open Android Studio to build APK
npx cap open android
```
Inside Android Studio, select **Build > Build Bundle(s) / APK(s) > Build APK(s)** to output the runnable `.apk` package.

---

## 🛠️ Troubleshooting

| Issue / Symptom | Potential Cause | Resolution / Fix |
| :--- | :--- | :--- |
| **Data resets on Render restart** | Render free tier uses an ephemeral filesystem with default SQLite. | Attach a managed PostgreSQL database and set `DATABASE_URL` in Render environment settings. |
| **CORS policy error in browser console** | API origin mismatch between backend Flask CORS setup and frontend domain. | Ensure backend `app.py` specifies allowed frontend origins or initializes `CORS(app)` properly. |
| **Firebase token validation fails** | System clock skew between local machine/server and Firebase servers. | Synchronize local machine date/time via NTP servers and verify `serviceAccountKey.json` credentials. |
| **Capacitor Android build fails** | Missing Android SDK components or mismatched Java JDK version. | Install Android SDK 34 and ensure `JAVA_HOME` points to JDK 17+. |

---

## 🛡️ Security Notes

- **Password Hashing**: User passwords are never stored in plain text. All credentials rely on `bcrypt` blowfish hashing with salt.
- **Firebase Token Verification**: Firebase authentication headers are verified server-side via official Firebase Admin SDK credentials.
- **Role Isolation**: Frontend components conditionally render actions, and backend APIs validate user roles on protected routes.
- **Known Security Improvement Gaps**:
  - Development bypass modes (`DEV LOGIN`) present in prototype components should be completely stripped prior to production deployment.
  - Endpoints requiring authorization should consistently enforce `@token_required` decorators.

---

## 🔮 Future Improvements

- [ ] Remove hardcoded `DEV LOGIN` bypass mechanisms in `App.jsx`.
- [ ] Enforce `@token_required` authorization decorators across all backend endpoints.
- [ ] Refactor monolithic components in `App.jsx` into modular React components.
- [ ] Provision managed PostgreSQL instance on Render for permanent production data persistence.
- [ ] Enforce strict cryptographic signature checks for all incoming Firebase tokens.
- [ ] Add automated test suites (Pytest for Flask backend, Vitest for React frontend).
- [ ] Setup GitHub Actions CI/CD workflows for automated testing and linting.
- [ ] Integrate code formatting and static code analysis tooling (Ruff & ESLint / Prettier).

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for full details.

```
MIT License

Copyright (c) 2026 Piyush0450

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 👤 Author

**Piyush Chaurasiya (Piyush0450)**
- GitHub: [@Piyush0450](https://github.com/Piyush0450)
- Repository: [https://github.com/Piyush0450/SDMS](https://github.com/Piyush0450/SDMS)
