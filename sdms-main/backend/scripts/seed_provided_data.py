
import os
import sys
from datetime import date, time, datetime

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.connection import engine, Base, SessionLocal
from models.department import Department
from models.user import Teacher, Student, Admin
from models.academic import Class, Subject, Timetable, SubjectAllocation
from models.activity import Mark, Attendance
from models.finance import Fee
from models.library import LibraryBook, BookIssue
from sqlalchemy import text

# Helper to parse time string
def parse_time(t_str):
    if not t_str: return None
    t = datetime.strptime(t_str, "%H:%M:%S").time()
    return t

def seed_data():
    print("Dropping all tables to ensure fresh schema...")
    c = engine.connect()
    # Disable foreign key checks for drop
    if engine.dialect.name == 'mysql':
        c.execute(text("SET FOREIGN_KEY_CHECKS = 0"))
    elif engine.dialect.name == 'sqlite':
        c.execute(text("PRAGMA foreign_keys=OFF"))
    
    Base.metadata.drop_all(bind=engine)

    if engine.dialect.name == 'mysql':
        c.execute(text("SET FOREIGN_KEY_CHECKS = 1"))
    elif engine.dialect.name == 'sqlite':
        c.execute(text("PRAGMA foreign_keys=ON"))
    c.close()

    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    
    session = SessionLocal()
    try:
        print("Seeding data...")

        # 0. Admin (System Super Admin)
        admin = Admin(
            admin_id='A_001',
            name='System Super Admin',
            username='piyush_admin',
            role='super_admin',
            dob='25/09/2005',
            email='piyushchaurasiya348@gmail.com' # Updated super admin email
        )
        # However, reinit_db had password='admin'. Let's stick to seed.sql as requested.
        session.add(admin)
        session.flush()

        # 1. Departments
        dept_science = Department(department_id=1, department_name="Science", building="Newton Building", head_of_department=None)
        dept_commerce = Department(department_id=2, department_name="Commerce", building="Adam Smith Building", head_of_department=None)
        dept_arts = Department(department_id=3, department_name="Arts", building="Shakespeare Building", head_of_department=None)
        
        session.add_all([dept_science, dept_commerce, dept_arts])
        session.flush()

        # 2. Teachers
        teachers_data = [
            (101, "Dr. Sharma", "1978-03-15", "Male", "sharma@school.edu", "9876543210", "Delhi", 1, "2010-06-01", 85000.00, "Ph.D. Physics"),
            (102, "Ms. Patel", "1985-08-22", "Female", "patel@school.edu", "9876543211", "Mumbai", 1, "2012-07-15", 75000.00, "M.Sc. Mathematics"),
            (103, "Prof. Kumar", "1975-12-10", "Male", "kumar@school.edu", "9876543212", "Delhi", 1, "2008-04-01", 90000.00, "Ph.D. Chemistry"),
            (104, "Mr. Joshi", "1982-06-18", "Male", "joshi@school.edu", "9876543213", "Mumbai", 2, "2015-03-10", 70000.00, "M.Com Accountancy"),
            (105, "Dr. Reddy", "1980-11-30", "Female", "reddy@school.edu", "9876543214", "Hyderabad", 1, "2011-08-20", 82000.00, "Ph.D. Biology"),
            (106, "Ms. Desai", "1988-04-05", "Female", "desai@school.edu", "9876543215", "Mumbai", 3, "2016-06-15", 65000.00, "M.A. English"),
            (107, "Mr. Singh", "1983-09-25", "Male", "singh@school.edu", "9876543216", "Delhi", 2, "2014-02-01", 72000.00, "M.Com Economics"),
            (108, "Mrs. Choudhury", "1987-07-12", "Female", "choudhury@school.edu", "9876543217", "Kolkata", 1, "2018-04-01", 68000.00, "M.Tech Computer Sci")
        ]
        
        for t in teachers_data:
            teacher = Teacher(
                teacher_id=t[0], name=t[1], date_of_birth=date.fromisoformat(t[2]), gender=t[3],
                email=t[4], phone=t[5], address=t[6], department_id=t[7],
                joining_date=date.fromisoformat(t[8]), salary=t[9], qualification=t[10]
            )
            session.add(teacher)
        session.flush()

        # 3. Update Departments HOD
        dept_science.head_of_department = 103
        dept_commerce.head_of_department = 104
        dept_arts.head_of_department = 106
        session.flush()

        # 4. Classes
        classes_data = [
            (1, "10th A", 2024, 101, "Room 101", 35),
            (2, "10th B", 2024, 102, "Room 102", 32),
            (3, "11th Science", 2024, 103, "Room 201", 30),
            (4, "11th Commerce", 2024, 104, "Room 202", 28),
            (5, "12th Science", 2024, 105, "Room 301", 25)
        ]
        for c in classes_data:
            cls = Class(class_id=c[0], class_name=c[1], academic_year=c[2], class_teacher_id=c[3], room_number=c[4], strength=c[5])
            session.add(cls)
        session.flush()

        # 5. Students
        students_data = [
            (1, "Rohan Verma", "2008-05-10", "Male", "rohan@school.edu", "9876543201", "Delhi", 1, "2023-04-01"),
            (2, "Priya Singh", "2008-07-15", "Female", "priya@school.edu", "9876543202", "Mumbai", 1, "2023-04-01"),
            (3, "Amit Kumar", "2007-11-20", "Male", "amit@school.edu", "9876543203", "Delhi", 3, "2022-04-01"),
            (4, "Sneha Patel", "2007-03-25", "Female", "sneha@school.edu", "9876543204", "Mumbai", 3, "2022-04-01"),
            (5, "Rajesh Nair", "2006-09-12", "Male", "rajesh@school.edu", "9876543205", "Chennai", 5, "2021-04-01"),
            (6, "Anjali Sharma", "2006-12-05", "Female", "anjali@school.edu", "9876543206", "Delhi", 5, "2021-04-01"),
            (7, "Vikram Reddy", "2008-02-18", "Male", "vikram@school.edu", "9876543207", "Hyderabad", 2, "2023-04-01"),
            (8, "Meera Iyer", "2008-09-30", "Female", "meera@school.edu", "9876543208", "Chennai", 2, "2023-04-01"),
            (9, "Arjun Malhotra", "2007-06-22", "Male", "arjun@school.edu", "9876543209", "Delhi", 4, "2022-04-01"),
            (10, "Pooja Gupta", "2007-08-14", "Female", "pooja@school.edu", "9876543210", "Mumbai", 4, "2022-04-01")
        ]
        for s in students_data:
            student = Student(
                student_id=s[0], name=s[1], date_of_birth=date.fromisoformat(s[2]), gender=s[3],
                email=s[4], phone=s[5], address=s[6], class_id=s[7], admission_date=date.fromisoformat(s[8])
            )
            session.add(student)
        session.flush()

        # 6. Subjects
        subjects_data = [
            (1, "Mathematics", "MATH101", 1, 4),
            (2, "Physics", "PHYS101", 1, 4),
            (3, "Chemistry", "CHEM101", 1, 4),
            (4, "Biology", "BIO101", 1, 4),
            (5, "English", "ENG101", 3, 3),
            (6, "Accountancy", "ACC101", 2, 4),
            (7, "Economics", "ECO101", 2, 4),
            (8, "Computer Science", "CS101", 1, 4)
        ]
        for sub in subjects_data:
            subject = Subject(
                subject_id=sub[0], subject_name=sub[1], subject_code=sub[2],
                department_id=sub[3], credits=sub[4]
            )
            session.add(subject)
        session.flush()

        # 7. Marks (3NF: Removed percentage, grade)
        marks_data = [
            (1, 1, 1, 1, 'Midterm', 85.00, 100.00, '2024-03-15'),
            (2, 1, 2, 1, 'Midterm', 78.00, 100.00, '2024-03-16'),
            (3, 2, 1, 1, 'Midterm', 92.00, 100.00, '2024-03-15'),
            (4, 3, 2, 3, 'Final', 88.00, 100.00, '2024-03-20'),
            (5, 4, 3, 3, 'Midterm', 76.00, 100.00, '2024-03-18'),
            (6, 5, 8, 5, 'Quiz', 95.00, 100.00, '2024-03-10'),
            (7, 6, 1, 5, 'Final', 81.00, 100.00, '2024-03-22'),
            (8, 7, 5, 2, 'Assignment', 89.00, 100.00, '2024-03-12'),
            (9, 8, 6, 2, 'Midterm', 74.00, 100.00, '2024-03-14'),
            (10, 9, 7, 4, 'Quiz', 91.00, 100.00, '2024-03-11')
        ]
        for m in marks_data:
            mark = Mark(
                mark_id=m[0], student_id=m[1], subject_id=m[2], class_id=m[3],
                exam_type=m[4], marks_obtained=m[5], max_marks=m[6],
                exam_date=datetime.strptime(m[7], "%Y-%m-%d")
            )
            session.add(mark)
        session.flush()

        # 8. Attendance
        attendance_data = [
            (1, 1, 1, '2024-03-01', 'Present', None, 101),
            (2, 2, 1, '2024-03-01', 'Absent', 'Sick', 101),
            (3, 3, 3, '2024-03-01', 'Present', None, 103),
            (4, 4, 3, '2024-03-01', 'Leave', 'Family event', 103),
            (5, 5, 5, '2024-03-02', 'Present', None, 105),
            (6, 6, 5, '2024-03-02', 'Present', None, 105),
            (7, 7, 2, '2024-03-02', 'Absent', None, 102),
            (8, 8, 2, '2024-03-02', 'Present', None, 102)
        ]
        for a in attendance_data:
            att = Attendance(
                attendance_id=a[0], student_id=a[1], class_id=a[2],
                attendance_date=datetime.strptime(a[3], "%Y-%m-%d"),
                status=a[4], reason=a[5], recorded_by=a[6]
            )
            session.add(att)
        session.flush()

        # 9. Subject Allocations (New Table)
        # Allocate subjects to teachers for specific classes based on the previous timetable and reasonable assumptions
        allocations_data = [
            (1, 1, 1, 102), # Class 1 (10th A), Math, Ms. Patel
            (2, 1, 2, 101), # Class 1 (10th A), Physics, Dr. Sharma
            (3, 3, 3, 103), # Class 3 (11th Sci), Chem, Prof. Kumar
            (4, 4, 6, 104), # Class 4 (11th Com), Acc, Mr. Joshi
            (5, 5, 8, 108), # Class 5 (12th Sci), CS, Mrs. Choudhury
            (6, 2, 5, 106), # Class 2 (10th B), English, Ms. Desai
             # Add implied allocations from marks or general sense to fill gaps if strictly needed, 
             # but sticking to timetable sources is safest.
        ]
        for alloc in allocations_data:
            sa = SubjectAllocation(
                allocation_id=alloc[0], class_id=alloc[1], subject_id=alloc[2], teacher_id=alloc[3]
            )
            session.add(sa)
        session.flush()

        # 10. Timetable (3NF: Removed teacher_id, relies on SubjectAllocation)
        timetable_data = [
            (1, 1, 1, 'Monday', 1, '08:00:00', '08:45:00', 'Room 101'), # Teacher 102 implied
            (2, 1, 2, 'Monday', 2, '09:00:00', '09:45:00', 'Room 101'), # Teacher 101 implied
            (3, 3, 3, 'Monday', 1, '08:00:00', '08:45:00', 'Room 201'), # Teacher 103 implied
            (4, 4, 6, 'Tuesday', 1, '08:00:00', '08:45:00', 'Room 202'), # Teacher 104 implied
            (5, 5, 8, 'Wednesday', 2, '09:00:00', '09:45:00', 'Room 301'), # Teacher 108 implied
            (6, 2, 5, 'Thursday', 3, '10:00:00', '10:45:00', 'Room 102') # Teacher 106 implied
        ]
        for tm in timetable_data:
            timetable = Timetable(
                timetable_id=tm[0], class_id=tm[1], subject_id=tm[2],
                day_of_week=tm[3], period_number=tm[4],
                start_time=parse_time(tm[5]), end_time=parse_time(tm[6]),
                room_number=tm[7]
            )
            session.add(timetable)
        session.flush()

        # 11. Fees
        fees_data = [
            (1, 1, 'Tuition', 10000.00, '2024-03-01', '2024-02-28', 'Online', 'TXN001', 'Paid'),
            (2, 2, 'Tuition', 10000.00, '2024-03-01', '2024-03-02', 'Cash', 'TXN002', 'Paid'),
            (3, 3, 'Tuition', 12000.00, '2024-03-01', None, None, None, 'Pending'),
            (4, 4, 'Tuition', 12000.00, '2024-03-01', '2024-03-01', 'Card', 'TXN004', 'Paid'),
            (5, 5, 'Tuition', 15000.00, '2024-03-01', '2024-02-25', 'Online', 'TXN005', 'Paid'),
            (6, 6, 'Tuition', 15000.00, '2024-03-01', None, None, None, 'Overdue'),
            (7, 7, 'Examination', 2000.00, '2024-03-15', '2024-03-10', 'Online', 'TXN007', 'Paid')
        ]
        for f in fees_data:
            fee = Fee(
                fee_id=f[0], student_id=f[1], fee_type=f[2], amount=f[3],
                due_date=datetime.strptime(f[4], "%Y-%m-%d"),
                paid_date=datetime.strptime(f[5], "%Y-%m-%d") if f[5] else None,
                payment_method=f[6], transaction_id=f[7], status=f[8]
            )
            session.add(fee)
        session.flush()

        # 12. Library Books (3NF: Removed available_copies)
        library_books_data = [
            (1, "Introduction to Physics", "H.C. Verma", "9788121908", "Science", "Bharati Bhawan", 2010, 10, "A1"),
            (2, "Mathematics for Class 10", "R.D. Sharma", "9788194190", "Science", "Dhanpat Rai", 2019, 15, "A2"),
            (3, "The Great Gatsby", "F. Scott Fitzgerald", "978074327", "Literature", "Scribner", 1925, 5, "B1"),
            (4, "Fundamentals of Accountancy", "T.S. Grewal", "978818713", "Commerce", "Sultan Chand", 2020, 8, "C1"),
            (5, "Computer Programming", "E. Balagurusamy", "978007068", "Science", "McGraw Hill", 2018, 12, "A3")
        ]
        for lb in library_books_data:
            book = LibraryBook(
                book_id=lb[0], title=lb[1], author=lb[2], isbn=lb[3], category=lb[4],
                publisher=lb[5], publish_year=lb[6], total_copies=lb[7],
                shelf_number=lb[8]
            )
            session.add(book)
        session.flush()

        # 13. Book Issues
        book_issues_data = [
            (1, 1, 1, '2024-03-01', '2024-03-15', None, 0.00, 'Issued', 101),
            (2, 2, 2, '2024-03-01', '2024-03-15', '2024-03-10', 0.00, 'Returned', 101),
            (3, 3, 3, '2024-03-01', '2024-03-15', None, 0.00, 'Issued', 102),
            (4, 4, 9, '2024-03-05', '2024-03-19', None, 0.00, 'Issued', 104),
            (5, 5, 5, '2024-02-20', '2024-03-05', None, 50.00, 'Overdue', 108)
        ]
        for bi in book_issues_data:
            issue = BookIssue(
                issue_id=bi[0], book_id=bi[1], student_id=bi[2],
                issue_date=datetime.strptime(bi[3], "%Y-%m-%d"),
                due_date=datetime.strptime(bi[4], "%Y-%m-%d"),
                return_date=datetime.strptime(bi[5], "%Y-%m-%d") if bi[5] else None,
                fine_amount=bi[6], status=bi[7], issued_by=bi[8]
            )
            session.add(issue)
        session.flush()

        session.commit()
        print("3NF Data Seeding Complete Successfully.")

    except Exception as e:
        session.rollback()
        print(f"Error seeding data: {e}")
        import traceback
        traceback.print_exc()
    finally:
        session.close()

if __name__ == "__main__":
    seed_data()
