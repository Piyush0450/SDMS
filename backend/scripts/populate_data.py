
import sys
import os
import random
from datetime import date, datetime, timedelta

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.connection import SessionLocal
from models.models import Admin, Faculty, Student, Subject, Marks, Attendance
import bcrypt

def hash_pw(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def populate():
    db = SessionLocal()
    print("--- Starting Data Population ---")

    # 1. Populate Admins (Need 4 more)
    admins_count = db.query(Admin).count()
    if admins_count < 5:
        print(f"Adding {5 - admins_count} Admins...")
        for i in range(admins_count + 1, 6):
            uid = f"A_{i:03d}"
            if not db.query(Admin).filter_by(u_id=uid).first():
                db.add(Admin(
                    u_id=uid,
                    name=f"Admin User {i}",
                    admin_type="normal",
                    email=f"admin{i}@school.edu",
                    phone=f"98765430{i:02d}",
                    dob=date(1990, 1, 1),
                    password=hash_pw("password")
                ))
        db.commit()
    else:
        print("Admins sufficient.")

    # 2. Populate Faculty (Need 4 more)
    faculty_count = db.query(Faculty).count()
    if faculty_count < 5:
        print(f"Adding {5 - faculty_count} Faculty...")
        # Check existing UIDs to avoid conflict, assuming F_001 exists
        existing_uids = [f.u_id for f in db.query(Faculty).all()]
        
        for i in range(1, 10): # Try enough to fill gaps
            if faculty_count >= 5: break
            uid = f"F_{i:03d}"
            if uid not in existing_uids:
                db.add(Faculty(
                    u_id=uid,
                    name=f"Faculty Member {i}",
                    email=f"faculty{i}@school.edu",
                    phone=f"98765431{i:02d}",
                    dob=date(1980, 5, 20),
                    password=hash_pw("password")
                ))
                faculty_count += 1
        db.commit()
    else:
        print("Faculty sufficient.")

    # 3. Populate Marks (Need at least 5)
    marks_count = db.query(Marks).count()
    if marks_count < 5:
        print("Adding Marks...")
        students = db.query(Student).all()
        faculty = db.query(Faculty).all()
        subjects = db.query(Subject).all()
        
        if not students or not faculty or not subjects:
            print("Error: Need students, faculty, and subjects to add marks.")
        else:
            for i in range(10): # Add 10 marks
                s = random.choice(students)
                f = random.choice(faculty)
                sub = random.choice(subjects)
                
                db.add(Marks(
                    student_id=s.u_id,
                    faculty_id=f.u_id,
                    subject_id=sub.subject_id,
                    marks_obtained=random.uniform(50, 100),
                    max_marks=100.0
                ))
            db.commit()
    else:
        print("Marks sufficient.")

    # 4. Populate Attendance (Need at least 5)
    att_count = db.query(Attendance).count()
    if att_count < 5:
        print("Adding Attendance...")
        students = db.query(Student).all()
        faculty = db.query(Faculty).all()
        subjects = db.query(Subject).all()
        
        if not students or not faculty or not subjects:
             print("Error: Need students, faculty, and subjects to add attendance.")
        else:
            base_date = date.today()
            for i in range(10):
                s = random.choice(students)
                f = random.choice(faculty)
                sub = random.choice(subjects)
                day_offset = random.randint(0, 5)
                
                db.add(Attendance(
                    student_id=s.u_id,
                    faculty_id=f.u_id,
                    subject_id=sub.subject_id,
                    date=base_date - timedelta(days=day_offset),
                    status=random.choice(['Present', 'Absent', 'Late'])
                ))
            db.commit()
    else:
        print("Attendance sufficient.")

    print("--- Population Complete ---")
    db.close()

if __name__ == "__main__":
    populate()
