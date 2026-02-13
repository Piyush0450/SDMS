import sys
import os

# Ensure we're in the right path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database.connection import engine, Base, SessionLocal
# Import ALL models to ensure they are registered with Base.metadata
from models.user import User, Admin, Faculty, Student
from models.academic import Class, Subject, SubjectAllocation, Timetable
from models.department import Department
from models.activity import Attendance, Mark
from models.finance import Fee
from models.library import LibraryBook, BookIssue
from sqlalchemy import text

def reset_db():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    
    print("Creating all tables (New Schema)...")
    Base.metadata.create_all(bind=engine)
    
    print("DB Reset Complete.")

def seed_data():
    print("Seeding Initial Data (Faculty, Students, Admin)...")
    # This logic matches previous seed scripts but adapted for new Faculty model
    session = SessionLocal()
    
    # 1. Departments
    dept_sci = Department(department_name="Science", building="Block A")
    dept_math = Department(department_name="Mathematics", building="Block B")
    session.add_all([dept_sci, dept_math])
    session.flush() # to get IDs

    # 2. Classes
    c1 = Class(class_name="Class 10A", academic_year=2024, room_number="101")
    c2 = Class(class_name="Class 10B", academic_year=2024, room_number="102")
    session.add_all([c1, c2])
    session.flush()

    # 3. Faculties (Teachers)
    # Using existing data logic
    f1 = Faculty(name="Ramesh Sharma", email="sharma@school.edu", department_id=dept_sci.department_id, qualification="M.Sc Physics")
    f2 = Faculty(name="Surekha Patel", email="patel@school.edu", department_id=dept_math.department_id, qualification="M.Sc Math")
    session.add_all([f1, f2])
    
    from datetime import date
    
    # 4. Students
    s1 = Student(name="Rohan Gupta", email="rohan@school.edu", class_id=c1.class_id, date_of_birth=date(2008, 1, 1))
    s2 = Student(name="Priya Singh", email="priya@school.edu", class_id=c1.class_id, date_of_birth=date(2008, 2, 2))
    s3 = Student(name="Piyush Chaurasiya", email="piyushchaurasiya771@gmail.com", class_id=c2.class_id, date_of_birth=date(2005, 1, 1)) # Key User
    session.add_all([s1, s2, s3])
    
    # 5. Admin
    a1 = Admin(name="Super Admin", email="piyushchaurasiya348@gmail.com", role="super_admin", admin_id="A_001")
    session.add(a1)
    
    session.flush() # Ensure IDs

    # 6. Unified Users Table
    # We must create User entries for all above
    users = []
    
    # Admin
    users.append(User(email=a1.email, role=a1.role, related_id=a1.admin_id))
    
    # Faculty
    # Note: Faculty uid not set in loop above, need to fix or assume logic. 
    # Current models.faculty has faculty_uid. 
    # Let's simple set them manually or update the objects
    f1.faculty_uid = "F_001"
    f2.faculty_uid = "F_002"
    users.append(User(email=f1.email, role="faculty", related_id=f1.faculty_uid))
    users.append(User(email=f2.email, role="faculty", related_id=f2.faculty_uid))
    
    # Students
    s1.student_uid = "S_001"
    s2.student_uid = "S_002"
    s3.student_uid = "S_003"
    users.append(User(email=s1.email, role="student", related_id=s1.student_uid))
    users.append(User(email=s2.email, role="student", related_id=s2.student_uid))
    users.append(User(email=s3.email, role="student", related_id=s3.student_uid))
    
    session.add_all(users)

    session.commit()
    session.close()
    print("Seeding Complete.")

if __name__ == "__main__":
    reset_db()
    seed_data()
