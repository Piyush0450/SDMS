# SDMS Backend (Flask)

## Quick Start
```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
The server runs on `http://localhost:5000`.

To seed Super Admin (A_001 / superadmin / password: 01/01/1980):
- Start the server once (to create tables).
- Then open SQLite DB `backend/database/sdms.sqlite3` and run `database/seed.sql` (or use your favorite tool).

## Endpoints (sample)
- POST `/api/auth/login` { role, id, password }
- GET `/api/admin/faculty`, POST `/api/admin/faculty`
- GET `/api/admin/students`, POST `/api/admin/students`
- POST `/api/admin/admins`  (requires `caller_role: super_admin` in body)
- POST `/api/faculty/attendance`
- POST `/api/faculty/results`
- GET `/api/student/<sid>/profile`
- GET `/api/student/<sid>/attendance`
- GET `/api/student/<sid>/results`
