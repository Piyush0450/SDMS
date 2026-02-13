# SDMS API Testing Guide (Postman)

This guide provides a comprehensive list of API endpoints for the Student Data Management System (SDMS), including request formats, success responses, and negative test cases.

**Base URL:** `http://localhost:5000`

---

## 🔐 Authentication API (`/api/auth/login`)

This unified endpoint handles all login types. The server decides which logic to use based on the request body.

### 1. Google Login (Firebase)
*   **Request Body:** `{"token": "FIREBASE_ID_TOKEN"}`
*   **Logic:** Verifies token and looks up user by email.

### 2. UID / DOB Login
*   **Request Body:** `{"username": "S_001", "password": "2005-01-01"}`
*   **Logic:** Standard credential check against database.

### Negative Test Cases (Unified Endpoint):
*   **Invalid Token (401):** Send malformed `token`.
*   **Wrong Password (401):** Valid `username`, wrong `password`.
*   **User Blocked (403):** Log in with a blocked account.
*   **User Not Found (404):** Email/UID not in system.
*   **Invalid Request (400):** Send data without `token` or `username`.

---

## 🚪 Logout API (`/api/auth/logout`)
*Requires Header: `Authorization: Bearer <JWT_TOKEN>`*

*   **Method:** `POST`
*   **Path:** `/api/auth/logout`
*   **Logic:** Adds the current JWT token to the blacklist. After logout, the token will no longer work for any authenticated requests.
*   **Success Response (200):** `{"ok": true, "message": "Logged out successfully"}`
*   **Negative Test Cases:**
    *   **No Token (400):** Send request without Authorization header.
    *   **Invalid Token (401):** Send malformed or already blacklisted token.

## 👨‍💼 Admin APIs (`/api/admin`)
*Requires Header: `Authorization: Bearer <JWT_TOKEN>`*

### 1. User Management (Students/Faculty)
*   **Add Student:** `POST /api/admin/students`
    *   **Body:** `{"u_id": "S_002", "name": "John Doe", "email": "john@school.edu", "dob": "2006-05-15", "phone": "1234567890"}`
    *   **Negative:** `400 Bad Request` if `u_id` already exists or email is invalid.
*   **Delete Student:** `DELETE /api/admin/students/<uid>`
    *   **Negative Test Case (Unauthorized):**
        *   **Actor:** Faculty Token
        *   **Action:** Try to delete student `S_008`.
        *   **Expected Response:** `403 Forbidden`
        *   **Message:** `{"ok": false, "error": "Access denied: Insufficient privileges"}`
*   **Update User Status (Block/Unblock):** `PUT /api/admin/users/<role>/<uid>/status`
    *   **To Block:**
        *   **Body:** `{"status": "blocked", "reason": "Found cheating"}`
    *   **To Unblock:**
        *   **Body:** `{"status": "active"}`
    *   **Negative:** `400` if trying to block yourself. `403` if a normal admin tries to block another admin or super admin.

*   **View All Students/Faculty (includes status):** `GET /api/admin/users/<role>`
    *   **Example:** `GET http://localhost:5000/api/admin/users/student`
    *   **Usage:** Returns a list of all students. Look for `"status": "blocked"` in the response to identify blocked individuals.

### 2. Reports
*   **Attendance Report:** `GET /api/admin/reports/attendance`
*   **Performance Report:** `GET /api/admin/reports/performance`

---

## 👩‍🏫 Faculty APIs (`/api/faculty`)
*Requires Header: `Authorization: Bearer <JWT_TOKEN>`*

### 1. Mark Attendance
*   **Method:** `POST`
*   **Path:** `/api/faculty/attendance`
*   **Body:**
    ```json
    {
      "faculty_id": "F_001",
      "subject_id": 1,
      "date": "2024-02-12",
      "statusMap": {
        "S_001": "present",
        "S_002": "absent"
      }
    }
    ```
*   **Negative Test Cases:**
    *   **Future Date (400 Bad Request):** Try marking attendance for tomorrow.
    *   **Unauthorized (403 Forbidden):** Send a `faculty_id` that doesn't match your token.

### 2. Upload Marks (Bulk)
*   **Method:** `POST`
*   **Path:** `/api/faculty/results`
*   **Body:** `{"faculty_id": "F_001", "subject_id": 1, "max_marks": 100, "marksMap": {"S_001": 85}}`
*   **Negative:** `400` if marks are outside range `0-100`.

### 3. Update Marks (Single Student)
*   **Method:** `PUT`
*   **Path:** `/api/faculty/results/<student_id>/<subject_id>`
*   **Example:** `/api/faculty/results/S_008/1`
*   **Body:** 
    ```json
    {
      "marks_obtained": 95.0
    }
    ```
*   **Purpose:** Use this if you made a mistake and need to change marks that were already uploaded.

---

## 🎓 Student APIs (`/api/student`)
*Requires Header: `Authorization: Bearer <JWT_TOKEN>`*

### 1. View Profile
*   **Path:** `GET /api/student/<uid>/profile`
*   **Negative Case (Unauthorized):**
    *   **Actor:** Student `S_001` Token
    *   **Action:** Try to access `GET /api/student/S_005/profile`
    *   **Expected Response:** `403 Forbidden`
    *   **Message:** `{"ok": false, "error": "Unauthorized access to another profile"}`

### 2. Results & Attendance
*   **My Results:** `GET /api/student/results`
*   **Attendance Summary:** `GET /api/student/attendance/summary`

---

## 📊 Dashboard Metrics (`/api/dashboard`)

*   **Admin Stats:** `GET /api/dashboard/admin/stats`
*   **Faculty Stats:** `GET /api/dashboard/faculty/<uid>/stats`
*   **Student Stats:** `GET /api/dashboard/student/<uid>/stats`
---

## 🛠️ Maintenance & System APIs

These endpoints are used for system health checks and auditing by administrators.

### 1. System Health Check
*   **Method:** `GET`
*   **Path:** `/`
*   **Auth Required:** None
*   **Success Response (200):** `{"message": "SDMS Backend Running (Strict Schema)"}`

### 2. View Audit Logs
*   **Method:** `GET`
*   **Path:** `/api/admin/audit-logs`
*   **Auth Required:** `Authorization: Bearer <ADMIN_TOKEN>`
*   **Purpose:** View a history of all blocking and unblocking actions performed by admins.
*   **Success Response (200):** 
    ```json
    [
      {
        "id": 1,
        "actor_id": "A_001",
        "target_id": "S_001",
        "action": "BLOCK",
        "reason": "Found cheating",
        "timestamp": "2024-02-13"
      }
    ]
    ```

---

## 💡 Troubleshooting
*   **401 Unauthorized:** Ensure your JWT token hasn't expired (tokens last 2 hours).
*   **403 Forbidden:** You are attempting to access data outside your assigned role.
*   **Token Prefix:** Always include `Bearer ` before your token in the Postman Authorization tab.
