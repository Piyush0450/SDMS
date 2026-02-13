import sys
import os
import random
from datetime import datetime, timedelta, date

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database.connection import SessionLocal
from models.user import Faculty, Student
from models.academic import Class, Subject, SubjectAllocation, Timetable
from models.department import Department
from models.activity import Attendance, Mark
from models.finance import Fee
from models.library import LibraryBook, BookIssue
from sqlalchemy import select

def seed_activity():
    db = SessionLocal()
    print("Starting Activity Seeding...")

    try:
        # 1. Fetch Key Entities
        f1 = db.scalars(select(Faculty).where(Faculty.faculty_uid == "F_001")).first() # Ramesh (Science)
        f2 = db.scalars(select(Faculty).where(Faculty.faculty_uid == "F_002")).first() # Surekha (Math)
        
        c1 = db.scalars(select(Class).where(Class.class_name == "Class 10A")).first()
        c2 = db.scalars(select(Class).where(Class.class_name == "Class 10B")).first()
        
        dept_sci = db.scalars(select(Department).where(Department.department_name == "Science")).first()
        dept_math = db.scalars(select(Department).where(Department.department_name == "Mathematics")).first()

        students = db.scalars(select(Student)).all()

        if not (f1 and f2 and c1 and c2):
            print("Error: Base entities not found. Run reset_and_seed_v2.py first.")
            return

        # 2. Subjects
        sub_math = Subject(subject_name="Mathematics", subject_code="MATH101", department_id=dept_math.department_id, credits=4)
        sub_phy = Subject(subject_name="Physics", subject_code="PHY101", department_id=dept_sci.department_id, credits=3)
        sub_chem = Subject(subject_name="Chemistry", subject_code="CHEM101", department_id=dept_sci.department_id, credits=3)
        sub_eng = Subject(subject_name="English", subject_code="ENG101", department_id=None, credits=2)
        
        db.add_all([sub_math, sub_phy, sub_chem, sub_eng])
        db.flush() # Get IDs

        # 3. Allocations (Assign Teachers to Classes for Subjects)
        # Ramesh (F1) teaches PHY and CHEM to 10A & 10B
        allocs = []
        for c in [c1, c2]:
            allocs.append(SubjectAllocation(class_id=c.class_id, subject_id=sub_phy.subject_id, teacher_id=f1.faculty_id))
            allocs.append(SubjectAllocation(class_id=c.class_id, subject_id=sub_chem.subject_id, teacher_id=f1.faculty_id))
            # Surekha (F2) teaches MATH to 10A & 10B
            allocs.append(SubjectAllocation(class_id=c.class_id, subject_id=sub_math.subject_id, teacher_id=f2.faculty_id))
        
        db.add_all(allocs)
        
        from datetime import time
        # 4. Timetable (Sample for 10A)
        # f1: Faculty ID, sub: Subject Object
        # Mon: Math(F2), Phy(F1)
        tt1 = Timetable(class_id=c1.class_id, subject_id=sub_math.subject_id, day_of_week='Monday', period_number=1, start_time=time(9, 0), end_time=time(10, 0), room_number="101")
        tt2 = Timetable(class_id=c1.class_id, subject_id=sub_phy.subject_id, day_of_week='Monday', period_number=2, start_time=time(10, 0), end_time=time(11, 0), room_number="101")
        db.add_all([tt1, tt2])

        # 5. Activity (Attendance and Marks)
        print("Generating Attendance and Marks...")
        today = date.today()
        start_date = today - timedelta(days=30)
        
        for s in students:
            # Attendance: 30 days history
            # Need to pick a subject allocation to mark attendance against. Usually attendance is per class per day or per subject.
            # Schema has subject_id in attendance. Let's assume Physics attendance for simplicity.
            for i in range(30):
                d = start_date + timedelta(days=i)
                if d.weekday() < 5: # Weekdays only
                    status = "Present"
                    if random.random() > 0.8: status = "Absent"
                    
                    att = Attendance(
                        student_id=s.student_id,
                        class_id=s.class_id,
                        attendance_date=d, # passing date object
                        status=status,
                        subject_id=sub_phy.subject_id,
                        recorded_by=f1.faculty_id
                    )
                    db.add(att)
            
            # Marks
            # Math
            m1 = Mark(student_id=s.student_id, subject_id=sub_math.subject_id, class_id=s.class_id, exam_type="Midterm", marks_obtained=random.uniform(60, 95), max_marks=100, exam_date=today)
            # Physics
            m2 = Mark(student_id=s.student_id, subject_id=sub_phy.subject_id, class_id=s.class_id, exam_type="Midterm", marks_obtained=random.uniform(50, 90), max_marks=100, exam_date=today)
            db.add_all([m1, m2])

        # 6. Library
        print("Generating Library Data...")
        b1 = LibraryBook(title="Concepts of Physics", author="H.C. Verma", isbn="978-8177091878", total_copies=5, shelf_number="A1")
        b2 = LibraryBook(title="Clean Code", author="Robert C. Martin", isbn="978-0132350884", total_copies=3, shelf_number="B2")
        db.add_all([b1, b2])
        db.flush()

        # Issue book to S_003 (Piyush)
        s_piyush = db.scalars(select(Student).where(Student.student_uid == "S_003")).first()
        if s_piyush:
            issue = BookIssue(book_id=b2.book_id, student_id=s_piyush.student_id, issue_date=today, due_date=today+timedelta(days=14), status='Issued', issued_by=f1.faculty_id)
            db.add(issue)
            
            # 7. Fees
            fee1 = Fee(student_id=s_piyush.student_id, fee_type="Tuition Fee", amount=5000.00, due_date=today+timedelta(days=30), status="Paid")
            fee2 = Fee(student_id=s_piyush.student_id, fee_type="Bus Fee", amount=3000.00, due_date=today+timedelta(days=30), status="Pending")
            db.add_all([fee1, fee2])

        db.commit()
        print("Seeding Activity Complete!")

    except Exception as e:
        db.rollback()
        print(f"Seeding Failed: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    seed_activity()
