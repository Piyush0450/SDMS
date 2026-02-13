# SDMS – Student Data Management System (Full Stack)

This zip contains a **complete frontend + backend** starter matching your requirements:
- Home page with "Welcome to SDMS Portal" & login (top-right)
- Role-based dashboards for Super Admin, Admin, Faculty, Student
- Registration pages (Admin by Super Admin, Faculty, Student)
- IDs auto-style: `F_###` and `S_###`; default password = DOB
- Professional UI with Tailwind, hover effects & animations

## Run Backend
```
cd backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
Then seed Super Admin using `database/seed.sql` (admin_id `A_001`, username `superadmin`, password `01/01/1980`).

## Run Frontend
```
cd frontend
npm install
npm run dev
```
Open the shown local URL. Login as Super Admin using:
- ID: `A_001` (or username `superadmin`)
- Password: `01/01/1980`

Now you can add Admins/Faculty/Students and use the app end-to-end.
