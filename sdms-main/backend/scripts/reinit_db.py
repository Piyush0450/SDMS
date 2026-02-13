
import os
import sys
from datetime import datetime, date, time

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

print("Importing database connection...")
try:
    from database.connection import engine, Base, SessionLocal
    print("Imported database.connection")
except Exception as e:
    print(f"Failed to import database.connection: {e}")
    # Also Check if it is a deeper error
    import traceback
    with open("reinit_capture.txt", "w") as f:
        traceback.print_exc(file=f)
    raise
print("Importing sqlalchemy text...")
from sqlalchemy import text
print("Importing models.user...")
try:
    from models.user import Admin, Teacher, Student
    print("Imported models.user")
    with open("tables_list.txt", "w") as f:
        f.write(str(list(Base.metadata.tables.keys())))
except ImportError as e:
    print(f"Failed to import models.user: {e}")
    raise

print("Importing models.department...")
try:
    from models.department import Department
    print("Imported models.department")
    print(f"Tables: {list(Base.metadata.tables.keys())}")
except ImportError as e:
    print(f"Failed to import models.department: {e}")
    raise
    
print("Importing models.academic...")
try:
    from models.academic import Class, Subject, Timetable
    print("Imported models.academic")
    print(f"Tables: {list(Base.metadata.tables.keys())}")
except Exception as e:
    print(f"Failed to import models.academic: {e}")
    # import traceback
    # traceback.print_exc()
    raise
print("Importing models.library...")
from models.library import LibraryBook, BookIssue
print("Importing models.finance...")
from models.finance import Fee
print("Importing models.activity...")
from models.activity import Attendance, Mark

def reinit_db():
    print("Re-initializing database...")
    
    # 1. Backup Admin Data
    session = SessionLocal()
    admins = []
    try:
        admins = session.query(Admin).all()
        print(f"Backed up {len(admins)} admin records.")
        # Detach objects from session to keep them after close
        session.expunge_all()
    except Exception as e:
        print(f"No existing admin data or error: {e}")
    finally:
        session.close()

    # 2. Drop all tables
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)

    # 3. Create all tables
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)

    # 4. Restore Admin Data
    session = SessionLocal()
    if admins:
        print("Restoring admin data...")
        for admin in admins:
            session.merge(admin)
        session.commit()
    else:
        # Create default admin if none existed
        print("Creating default admin...")
        default_admin = Admin(
            admin_id="A_001",
            name="System Super Admin",
            username="piyush_admin",
            role="super_admin",
            dob="25/09/2005",
            password="admin"
        )
        session.add(default_admin)
        session.commit()

    # 5. Seed New Data
    print("Seeding new data...")
    seed_data(session)
    session.close()
    print("Database initialization complete.")

def seed_data(session):
    # --- Departments ---
    dept_science = Department(department_name="Science", building="Newton Building")
    dept_commerce = Department(department_name="Commerce", building="Adam Smith Building")
    dept_arts = Department(department_name="Arts", building="Shakespeare Building")
    session.add_all([dept_science, dept_commerce, dept_arts])
    session.commit()

    # --- Teachers ---
    # Need to add teachers first to assign as HODs later
    t1 = Teacher(teacher_id=101, name="Dr. Sharma", date_of_birth=date(1978, 3, 15), gender='Male', email="sharma@school.edu", phone="9876543210", address="Delhi", department_id=dept_science.department_id, joining_date=date(2010, 6, 1), salary=85000.00, qualification="Ph.D. Physics")
    t2 = Teacher(teacher_id=102, name="Ms. Patel", date_of_birth=date(1985, 8, 22), gender='Female', email="patel@school.edu", phone="9876543211", address="Mumbai", department_id=dept_science.department_id, joining_date=date(2012, 7, 15), salary=75000.00, qualification="M.Sc. Mathematics")
    t3 = Teacher(teacher_id=103, name="Prof. Kumar", date_of_birth=date(1975, 12, 10), gender='Male', email="kumar@school.edu", phone="9876543212", address="Delhi", department_id=dept_science.department_id, joining_date=date(2008, 4, 1), salary=90000.00, qualification="Ph.D. Chemistry")
    t4 = Teacher(teacher_id=104, name="Mr. Joshi", date_of_birth=date(1982, 6, 18), gender='Male', email="joshi@school.edu", phone="9876543213", address="Mumbai", department_id=dept_commerce.department_id, joining_date=date(2015, 3, 10), salary=70000.00, qualification="M.Com Accountancy")
    t5 = Teacher(teacher_id=105, name="Dr. Reddy", date_of_birth=date(1980, 11, 30), gender='Female', email="reddy@school.edu", phone="9876543214", address="Hyderabad", department_id=dept_science.department_id, joining_date=date(2011, 8, 20), salary=82000.00, qualification="Ph.D. Biology")
    t6 = Teacher(teacher_id=106, name="Ms. Desai", date_of_birth=date(1988, 4, 5), gender='Female', email="desai@school.edu", phone="9876543215", address="Mumbai", department_id=dept_arts.department_id, joining_date=date(2016, 6, 15), salary=65000.00, qualification="M.A. English")
    t7 = Teacher(teacher_id=107, name="Mr. Singh", date_of_birth=date(1983, 9, 25), gender='Male', email="singh@school.edu", phone="9876543216", address="Delhi", department_id=dept_commerce.department_id, joining_date=date(2014, 2, 1), salary=72000.00, qualification="M.Com Economics")
    t8 = Teacher(teacher_id=108, name="Mrs. Choudhury", date_of_birth=date(1987, 7, 12), gender='Female', email="choudhury@school.edu", phone="9876543217", address="Kolkata", department_id=dept_science.department_id, joining_date=date(2018, 4, 1), salary=68000.00, qualification="M.Tech Computer Sci")
    
    session.add_all([t1, t2, t3, t4, t5, t6, t7, t8])
    session.commit()

    # Update HODs
    dept_science.head_of_department = t3.teacher_id
    dept_commerce.head_of_department = t4.teacher_id
    dept_arts.head_of_department = t6.teacher_id
    session.commit()

    # --- Classes ---
    c1 = Class(class_name="10th A", academic_year=2024, class_teacher_id=t1.teacher_id, room_number="Room 101", strength=35)
    c2 = Class(class_name="10th B", academic_year=2024, class_teacher_id=t2.teacher_id, room_number="Room 102", strength=32)
    c3 = Class(class_name="11th Science", academic_year=2024, class_teacher_id=t3.teacher_id, room_number="Room 201", strength=30)
    c4 = Class(class_name="11th Commerce", academic_year=2024, class_teacher_id=t4.teacher_id, room_number="Room 202", strength=28)
    c5 = Class(class_name="12th Science", academic_year=2024, class_teacher_id=t5.teacher_id, room_number="Room 301", strength=25)
    session.add_all([c1, c2, c3, c4, c5])
    session.commit()

    # --- Subjects ---
    sub1 = Subject(subject_name="Mathematics", subject_code="MATH101", department_id=dept_science.department_id, credits=4)
    sub2 = Subject(subject_name="Physics", subject_code="PHYS101", department_id=dept_science.department_id, credits=4)
    sub3 = Subject(subject_name="Chemistry", subject_code="CHEM101", department_id=dept_science.department_id, credits=4)
    sub4 = Subject(subject_name="Biology", subject_code="BIO101", department_id=dept_science.department_id, credits=4)
    sub5 = Subject(subject_name="English", subject_code="ENG101", department_id=dept_arts.department_id, credits=3)
    sub6 = Subject(subject_name="Accountancy", subject_code="ACC101", department_id=dept_commerce.department_id, credits=4)
    sub7 = Subject(subject_name="Economics", subject_code="ECO101", department_id=dept_commerce.department_id, credits=4)
    sub8 = Subject(subject_name="Computer Science", subject_code="CS101", department_id=dept_science.department_id, credits=4)
    session.add_all([sub1, sub2, sub3, sub4, sub5, sub6, sub7, sub8])
    session.commit()

    # --- Students ---
    s1 = Student(name="Rohan Verma", date_of_birth=date(2008, 5, 10), gender='Male', email="rohan@school.edu", phone="9876543201", address="Delhi", class_id=c1.class_id, admission_date=date(2023, 4, 1))
    s2 = Student(name="Priya Singh", date_of_birth=date(2008, 7, 15), gender='Female', email="priya@school.edu", phone="9876543202", address="Mumbai", class_id=c1.class_id, admission_date=date(2023, 4, 1))
    s3 = Student(name="Amit Kumar", date_of_birth=date(2007, 11, 20), gender='Male', email="amit@school.edu", phone="9876543203", address="Delhi", class_id=c3.class_id, admission_date=date(2022, 4, 1))
    s4 = Student(name="Sneha Patel", date_of_birth=date(2007, 3, 25), gender='Female', email="sneha@school.edu", phone="9876543204", address="Mumbai", class_id=c3.class_id, admission_date=date(2022, 4, 1))
    s5 = Student(name="Rajesh Nair", date_of_birth=date(2006, 9, 12), gender='Male', email="rajesh@school.edu", phone="9876543205", address="Chennai", class_id=c5.class_id, admission_date=date(2021, 4, 1))
    s6 = Student(name="Anjali Sharma", date_of_birth=date(2006, 12, 5), gender='Female', email="anjali@school.edu", phone="9876543206", address="Delhi", class_id=c5.class_id, admission_date=date(2021, 4, 1))
    s7 = Student(name="Vikram Reddy", date_of_birth=date(2008, 2, 18), gender='Male', email="vikram@school.edu", phone="9876543207", address="Hyderabad", class_id=c2.class_id, admission_date=date(2023, 4, 1))
    s8 = Student(name="Meera Iyer", date_of_birth=date(2008, 9, 30), gender='Female', email="meera@school.edu", phone="9876543208", address="Chennai", class_id=c2.class_id, admission_date=date(2023, 4, 1))
    s9 = Student(name="Arjun Malhotra", date_of_birth=date(2007, 6, 22), gender='Male', email="arjun@school.edu", phone="9876543209", address="Delhi", class_id=c4.class_id, admission_date=date(2022, 4, 1))
    s10 = Student(name="Pooja Gupta", date_of_birth=date(2007, 8, 14), gender='Female', email="pooja@school.edu", phone="9876543210", address="Mumbai", class_id=c4.class_id, admission_date=date(2022, 4, 1))
    session.add_all([s1, s2, s3, s4, s5, s6, s7, s8, s9, s10])
    session.commit()

    # --- Timetable ---
    # Sample 6
    tt1 = Timetable(class_id=c1.class_id, subject_id=sub1.subject_id, teacher_id=t2.teacher_id, day_of_week='Monday', period_number=1, start_time=time(8, 0), end_time=time(8, 45), room_number="Room 101")
    tt2 = Timetable(class_id=c1.class_id, subject_id=sub2.subject_id, teacher_id=t1.teacher_id, day_of_week='Monday', period_number=2, start_time=time(9, 0), end_time=time(9, 45), room_number="Room 101")
    tt3 = Timetable(class_id=c3.class_id, subject_id=sub3.subject_id, teacher_id=t3.teacher_id, day_of_week='Monday', period_number=1, start_time=time(8, 0), end_time=time(8, 45), room_number="Room 201")
    session.add_all([tt1, tt2, tt3])
    session.commit()

    # --- Marks ---
    m1 = Mark(student_id=s1.student_id, subject_id=sub1.subject_id, class_id=c1.class_id, exam_type='Midterm', marks_obtained=85.00, grade='A', exam_date=datetime(2024, 3, 15))
    m2 = Mark(student_id=s1.student_id, subject_id=sub2.subject_id, class_id=c1.class_id, exam_type='Midterm', marks_obtained=78.00, grade='B+', exam_date=datetime(2024, 3, 16))
    session.add_all([m1, m2])
    session.commit()

    # --- Attendance ---
    att1 = Attendance(student_id=s1.student_id, class_id=c1.class_id, attendance_date=datetime(2024, 3, 1), status='Present', recorded_by=t1.teacher_id)
    att2 = Attendance(student_id=s2.student_id, class_id=c1.class_id, attendance_date=datetime(2024, 3, 1), status='Absent', reason="Sick", recorded_by=t1.teacher_id)
    session.add_all([att1, att2])
    session.commit()

    # --- Fees ---
    f1 = Fee(student_id=s1.student_id, fee_type='Tuition', amount=10000.00, due_date=datetime(2024, 3, 1), paid_date=datetime(2024, 2, 28), payment_method='Online', transaction_id='TXN001', status='Paid')
    f2 = Fee(student_id=s2.student_id, fee_type='Tuition', amount=10000.00, due_date=datetime(2024, 3, 1), paid_date=datetime(2024, 3, 2), payment_method='Cash', transaction_id='TXN002', status='Paid')
    session.add_all([f1, f2])
    session.commit()

    # --- Library ---
    lb1 = LibraryBook(title="Introduction to Physics", author="H.C. Verma", isbn="9788121908", category="Science", publisher="Bharati Bhawan", publish_year=2010, total_copies=10, available_copies=8, shelf_number="A1")
    lb2 = LibraryBook(title="The Great Gatsby", author="F. Scott Fitzgerald", isbn="978074327", category="Literature", publisher="Scribner", publish_year=1925, total_copies=5, available_copies=3, shelf_number="B1")
    session.add_all([lb1, lb2])
    session.commit()

    bi1 = BookIssue(book_id=lb1.book_id, student_id=s1.student_id, issue_date=datetime(2024, 3, 1), due_date=datetime(2024, 3, 15), status='Issued', issued_by=t1.teacher_id)
    session.add([bi1])
    session.commit()


if __name__ == "__main__":
    reinit_db()
