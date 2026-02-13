import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database.connection import SessionLocal, engine, Base
from models.user import User, Admin, Faculty, Student
# Ensure all models are imported to avoid mapper errors
from models.department import Department
from models.academic import Class, Subject
from models.activity import Mark, Attendance
from models.finance import Fee
from models.library import BookIssue
from sqlalchemy import select, text

def migrate():
    # 1. Create the table in DB
    print("Creating 'users' table...")
    Base.metadata.create_all(bind=engine)

    with SessionLocal() as db:
        # Clear existing to avoid duplicates during dev
        db.execute(text("DELETE FROM users")) # users table name

        # 2. Migrate Admins
        admins = db.scalars(select(Admin)).all()
        for i, a in enumerate(admins):
            if not a.email: continue
            
            # Generate A_001 if not exists (rudimentary generator for dev)
            uid = a.admin_id
            if not uid or not uid.startswith("A_"):
                uid = f"A_{str(i+1).zfill(3)}"
                a.admin_id = uid
            
            print(f"Migrating Admin: {a.email} -> {uid}")
            u = User(
                email=a.email,
                role=('super_admin' if a.role == 'super_admin' else 'admin'),
                related_id=uid
            )
            db.add(u)
        
        # 3. Migrate Faculty (Teacher)
        teachers = db.scalars(select(Faculty)).all()
        for i, t in enumerate(teachers):
            if not t.email: continue
            
            # Generate F_00X
            uid = f"F_{str(i+1).zfill(3)}"
            t.faculty_uid = uid
            
            print(f"Migrating Faculty: {t.email} -> {uid}")
            u = User(
                email=t.email,
                role='faculty',
                related_id=uid
            )
            db.add(u)

        # 4. Migrate Students
        students = db.scalars(select(Student)).all()
        for i, s in enumerate(students):
            if not s.email: continue
            
            # Generate S_00X
            uid = f"S_{str(i+1).zfill(3)}"
            s.student_uid = uid
            
            print(f"Migrating Student: {s.email} -> {uid}")
            u = User(
                email=s.email,
                role='student',
                related_id=uid
            )
            db.add(u)
        
        try:
            db.commit()
            print("Migration successful!")
        except Exception as e:
            db.rollback()
            print(f"Migration Failed: {e}")

if __name__ == "__main__":
    migrate()
