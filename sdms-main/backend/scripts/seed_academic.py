from sqlalchemy import select
from database.connection import SessionLocal, engine, Base
from models.user import Student, Faculty, Admin
from models.academic import Class, Subject, SubjectAllocation, Attendance, Result
import random
from datetime import datetime, timedelta

def seed():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    with SessionLocal() as db:
        print("Seeding Academic Data...")

        # 1. Create Subjects
        subjects = ["Mathematics", "Physics", "Chemistry", "English", "Computer Science"]
        sub_objs = []
        for s in subjects:
            existing = db.scalars(select(Subject).where(Subject.name == s)).first()
            if not existing:
                obj = Subject(name=s, code=s[:3].upper())
                db.add(obj)
                sub_objs.append(obj)
            else:
                sub_objs.append(existing)
        db.flush()

        # 2. Create Classes
        classes = [{"grade": "10", "section": "A"}, {"grade": "10", "section": "B"}, {"grade": "11", "section": "A"}]
        cls_objs = []
        for c in classes:
            existing = db.scalars(select(Class).where(Class.grade == c['grade'], Class.section == c['section'])).first()
            if not existing:
                obj = Class(grade=c['grade'], section=c['section'])
                db.add(obj)
                cls_objs.append(obj)
            else:
                cls_objs.append(existing)
        db.flush()

        # 3. Assign Faculty (Randomly from existing)
        faculties = db.scalars(select(Faculty)).all()
        if faculties:
            for cls in cls_objs:
                for sub in sub_objs:
                    # check allocation
                    exists = db.scalars(select(SubjectAllocation).where(
                        SubjectAllocation.class_id == cls.id,
                        SubjectAllocation.subject_id == sub.id
                    )).first()
                    if not exists:
                        fac = random.choice(faculties)
                        db.add(SubjectAllocation(class_id=cls.id, subject_id=sub.id, faculty_id=fac.id))
        
        # 4. Assign Students to Classes & Generate Attendance/Results
        students = db.scalars(select(Student)).all()
        for s in students:
            # Assign class
            if not s.class_id:
                cls = random.choice(cls_objs)
                s.class_id = cls.id
                db.add(s) # Update student
            
            # Generate 1 week of attendance
            today = datetime.now()
            for i in range(7):
                d = (today - timedelta(days=i)).strftime("%Y-%m-%d")
                # Random status
                status = "present" if random.random() > 0.2 else "absent"
                # Record for one subject or daily? 
                # Model supports Subject. Let's record for Math (first subject)
                if sub_objs:
                    exists = db.scalars(select(Attendance).where(Attendance.student_id==s.id, Attendance.date==d)).first()
                    if not exists:
                        db.add(Attendance(student_id=s.id, subject_id=sub_objs[0].id, date=d, status=status))

            # Generate Results
            for sub in sub_objs:
                exists = db.scalars(select(Result).where(Result.student_id==s.id, Result.subject_id==sub.id)).first()
                if not exists:
                    marks = random.randint(40, 99)
                    db.add(Result(student_id=s.id, subject_id=sub.id, exam_type="Midterm", marks_obtained=marks, total_marks=100))

        db.commit()
        print("Seeding Complete!")

if __name__ == "__main__":
    seed()
