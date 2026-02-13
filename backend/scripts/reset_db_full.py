from database.connection import Base, engine, SessionLocal
from models.user import Admin, Faculty, Student, User
from models.academic import Class, Subject, SubjectAllocation, Attendance, Result
from sqlalchemy import select
from datetime import datetime, timedelta, date
import random

def reset_and_seed():
    print("🗑️ Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("🏗️ Creating all tables...")
    Base.metadata.create_all(bind=engine)

    with SessionLocal() as db:
        print("🌱 Seeding Users...")
        
        # 1. Admin
        admin = Admin(
            admin_id="A_001", 
            name="Super Admin", 
            username="admin", 
            role="super_admin", 
            dob="01/01/2000",
            email="piyushchaurasiya348@gmail.com"
        )
        db.add(admin)
        db.flush()
        
        # Create User entry for Admin
        db.add(User(
            email="piyushchaurasiya348@gmail.com",
            role="super_admin",
            related_id="A_001"
        ))
        
        # 2. Faculty
        f1 = Faculty(
            faculty_uid="F_001", 
            name="Dr. Smith", 
            email="faculty1@sdms.edu",
            date_of_birth=date(1980, 1, 1),
            department_id=None
        )
        f2 = Faculty(
            faculty_uid="F_002", 
            name="Prof. Doe", 
            email="faculty2@sdms.edu",
            date_of_birth=date(1985, 1, 1),
            department_id=None
        )
        db.add_all([f1, f2])
        db.flush()
        
        # Create User entries for Faculty
        db.add(User(email="faculty1@sdms.edu", role="faculty", related_id="F_001"))
        db.add(User(email="faculty2@sdms.edu", role="faculty", related_id="F_002"))

        # 3. Classes
        c1 = Class(grade="10", section="A")
        c2 = Class(grade="10", section="B")
        db.add_all([c1, c2])
        db.flush()

        # 4. Students
        s1 = Student(
            student_uid="S_001", 
            name="Alice", 
            email="student1@sdms.edu",
            date_of_birth=date(2005, 1, 1),
            class_id=c1.id, 
            admission_date=date(2024, 1, 15)
        )
        s2 = Student(
            student_uid="S_002", 
            name="Bob", 
            email="student2@sdms.edu",
            date_of_birth=date(2005, 1, 1),
            class_id=c1.id, 
            admission_date=date(2024, 2, 20)
        )
        s3 = Student(
            student_uid="S_003", 
            name="Charlie", 
            email="student3@sdms.edu",
            date_of_birth=date(2005, 1, 1),
            class_id=c2.id, 
            admission_date=date(2024, 3, 10)
        )
        db.add_all([s1, s2, s3])
        db.flush()
        
        # Create User entries for Students
        db.add(User(email="student1@sdms.edu", role="student", related_id="S_001"))
        db.add(User(email="student2@sdms.edu", role="student", related_id="S_002"))
        db.add(User(email="student3@sdms.edu", role="student", related_id="S_003"))

        print("📚 Seeding Academic Data...")
        
        # 5. Subjects
        sub1 = Subject(name="Physics", code="PHY")
        sub2 = Subject(name="Mathematics", code="MAT")
        db.add_all([sub1, sub2])
        db.flush()

        # 6. Allocations
        db.add(SubjectAllocation(class_id=c1.id, subject_id=sub1.id, faculty_id=f1.faculty_id))
        db.add(SubjectAllocation(class_id=c1.id, subject_id=sub2.id, faculty_id=f2.faculty_id))

        # 7. Attendance
        today = datetime.now()
        for i in range(5):
            d = (today - timedelta(days=i)).strftime("%Y-%m-%d")
            db.add(Attendance(student_id=s1.student_id, subject_id=sub1.id, date=d, status="present"))
            db.add(Attendance(student_id=s1.student_id, subject_id=sub2.id, date=d, status="present"))
            db.add(Attendance(student_id=s2.student_id, subject_id=sub1.id, date=d, status="absent" if i%2==0 else "present"))

        # 8. Results
        db.add(Result(student_id=s1.student_id, subject_id=sub1.id, exam_type="Midterm", marks_obtained=85, total_marks=100))
        db.add(Result(student_id=s1.student_id, subject_id=sub2.id, exam_type="Midterm", marks_obtained=90, total_marks=100))
        db.add(Result(student_id=s2.student_id, subject_id=sub1.id, exam_type="Midterm", marks_obtained=75, total_marks=100))

        db.commit()
        print("✅ Database successfully reset and seeded!")
        print("   📧 Super Admin: piyushchaurasiya348@gmail.com")
        print("   📧 Faculty 1: faculty1@sdms.edu")
        print("   📧 Faculty 2: faculty2@sdms.edu")
        print("   📧 Student 1: student1@sdms.edu")
        print("   📧 Student 2: student2@sdms.edu")
        print("   📧 Student 3: student3@sdms.edu")

if __name__ == "__main__":
    reset_and_seed()
