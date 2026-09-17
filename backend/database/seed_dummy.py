"""
Seed the SDMS database with realistic dummy data for full testing.
Usage:
    python -m database.seed_dummy          # add dummy data (keeps existing)
    python -m database.seed_dummy --reset  # wipe then reseed everything
"""
import sys
import os
import random
import bcrypt
from datetime import date, datetime, timedelta
from database.connection import get_db
from models.models import Admin, Faculty, Student, Subject, Marks, Attendance, AuditLog

# Ensure reproducible random generation
random.seed(42)

def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def parse_date(date_str: str) -> date:
    return datetime.strptime(date_str, "%Y-%m-%d").date()

def reset_all(db):
    print("Clearing existing data...")
    db.query(Attendance).delete()
    db.query(Marks).delete()
    db.query(AuditLog).delete()
    db.query(Subject).delete()
    db.query(Student).delete()
    db.query(Faculty).delete()
    db.query(Admin).delete()
    db.commit()
    print("All tables cleared successfully.")

def seed_admins(db):
    print("Seeding admins...")
    admins_data = [
        {
            "u_id": "A_001",
            "name": "Piyush Chaurasiya",
            "admin_type": "super",
            "email": "Piyushchaurasiya348@gmail.com",
            "phone": "9876543210",
            "dob": parse_date("2005-09-25"),
            "password": hash_password("2005-09-25"),
            "status": "active"
        },
        {
            "u_id": "A_002",
            "name": "Priya Sharma",
            "admin_type": "normal",
            "email": "priya.admin@sdms.edu",
            "phone": "9876543211",
            "dob": parse_date("1990-03-14"),
            "password": hash_password("1990-03-14"),
            "status": "active"
        },
        {
            "u_id": "A_003",
            "name": "Rohan Verma",
            "admin_type": "normal",
            "email": "rohan.admin@sdms.edu",
            "phone": "9876543212",
            "dob": parse_date("1988-11-02"),
            "password": hash_password("1988-11-02"),
            "status": "active"
        }
    ]

    for item in admins_data:
        existing = db.query(Admin).filter_by(u_id=item["u_id"]).first()
        if not existing:
            admin = Admin(**item)
            db.add(admin)
    db.commit()

def seed_faculty(db):
    print("Seeding faculty...")
    today = date.today()
    faculty_data = [
        {"u_id": "F_001", "name": "Dr. John Doe", "email": "faculty@school.edu", "phone": "9800000001", "dob": parse_date("1985-05-20"), "status": "active"},
        {"u_id": "F_002", "name": "Prof. Anita Rao", "email": "anita.rao@school.edu", "phone": "9800000002", "dob": parse_date("1982-07-11"), "status": "active"},
        {"u_id": "F_003", "name": "Dr. Sameer Khan", "email": "sameer.khan@school.edu", "phone": "9800000003", "dob": parse_date("1979-12-30"), "status": "active"},
        {"u_id": "F_004", "name": "Prof. Neha Gupta", "email": "neha.gupta@school.edu", "phone": "9800000004", "dob": parse_date("1986-02-18"), "status": "active"},
        {"u_id": "F_005", "name": "Dr. Vikram Singh", "email": "vikram.singh@school.edu", "phone": "9800000005", "dob": parse_date("1975-09-05"), "status": "active"},
        {
            "u_id": "F_006", "name": "Prof. Meera Iyer", "email": "meera.iyer@school.edu", "phone": "9800000006", "dob": parse_date("1988-04-22"),
            "status": "blocked", "blocked_by": "A_001", "blocked_reason": "Repeated policy violations", "blocked_at": today - timedelta(days=5)
        },
        {"u_id": "F_007", "name": "Dr. Arjun Mehta", "email": "arjun.mehta@school.edu", "phone": "9800000007", "dob": parse_date("1980-08-09"), "status": "active"},
        {"u_id": "F_008", "name": "Prof. Kavita Joshi", "email": "kavita.joshi@school.edu", "phone": "9800000008", "dob": parse_date("1984-01-27"), "status": "active"},
    ]

    for item in faculty_data:
        existing = db.query(Faculty).filter_by(u_id=item["u_id"]).first()
        if not existing:
            dob_str = item["dob"].strftime("%Y-%m-%d")
            item["password"] = hash_password(dob_str)
            faculty = Faculty(**item)
            db.add(faculty)
    db.commit()

def seed_students(db):
    print("Seeding students (30 total)...")
    today = date.today()
    students_list = [
        ("S_001", "Jane Smith", "student@school.edu", "9700000001", "2005-08-15", "active", None, None, None),
        ("S_002", "Aarav Patel", "aarav.patel@school.edu", "9700000002", "2006-02-11", "active", None, None, None),
        ("S_003", "Diya Sharma", "diya.sharma@school.edu", "9700000003", "2005-11-23", "active", None, None, None),
        ("S_004", "Kabir Reddy", "kabir.reddy@school.edu", "9700000004", "2006-05-17", "active", None, None, None),
        ("S_005", "Ananya Nair", "ananya.nair@school.edu", "9700000005", "2005-03-09", "active", None, None, None),
        ("S_006", "Vihaan Iyer", "vihaan.iyer@school.edu", "9700000006", "2006-07-21", "active", None, None, None),
        ("S_007", "Ishaan Bose", "ishaan.bose@school.edu", "9700000007", "2005-12-04", "active", None, None, None),
        ("S_008", "Myra Kapoor", "myra.kapoor@school.edu", "9700000008", "2006-01-30", "active", None, None, None),
        ("S_009", "Aditya Rao", "aditya.rao@school.edu", "9700000009", "2005-06-13", "active", None, None, None),
        ("S_010", "Sara Khan", "sara.khan@school.edu", "9700000010", "2006-09-02", "active", None, None, None),
        ("S_011", "Reyansh Jain", "reyansh.jain@school.edu", "9700000011", "2005-10-19", "active", None, None, None),
        ("S_012", "Aadhya Menon", "aadhya.menon@school.edu", "9700000012", "2006-04-08", "active", None, None, None),
        ("S_013", "Vivaan Deshmukh", "vivaan.deshmukh@school.edu", "9700000013", "2005-07-25", "active", None, None, None),
        ("S_014", "Sanaya Agarwal", "sanaya.agarwal@school.edu", "9700000014", "2006-03-12", "active", None, None, None),
        ("S_015", "Dhruv Saxena", "dhruv.saxena@school.edu", "9700000015", "2005-09-18", "active", None, None, None),
        ("S_016", "Avani Kulkarni", "avani.kulkarni@school.edu", "9700000016", "2006-08-30", "active", None, None, None),
        ("S_017", "Arjun Joshi", "arjun.joshi@school.edu", "9700000017", "2005-04-14", "active", None, None, None),
        ("S_018", "Riya Bhatt", "riya.bhatt@school.edu", "9700000018", "2006-11-05", "active", None, None, None),
        ("S_019", "Krishna Pillai", "krishna.pillai@school.edu", "9700000019", "2005-01-22", "active", None, None, None),
        ("S_020", "Pari Choudhury", "pari.choudhury@school.edu", "9700000020", "2006-06-10", "active", None, None, None),
        ("S_021", "Dev Sen", "dev.sen@school.edu", "9700000021", "2005-05-03", "active", None, None, None),
        ("S_022", "Maya Das", "maya.das@school.edu", "9700000022", "2006-10-27", "active", None, None, None),
        ("S_023", "Yash Malhotra", "yash.malhotra@school.edu", "9700000023", "2005-02-14", "active", None, None, None),
        ("S_024", "Isha Mishra", "isha.mishra@school.edu", "9700000024", "2006-12-08", "active", None, None, None),
        ("S_025", "Rohan Ghosh", "rohan.ghosh@school.edu", "9700000025", "2005-09-01", "blocked", "A_001", "Attendance below 50%", today - timedelta(days=3)),
        ("S_026", "Tanvi Hegde", "tanvi.hegde@school.edu", "9700000026", "2006-01-19", "blocked", "A_002", "Disciplinary action", today - timedelta(days=2)),
        ("S_027", "Shlok Roy", "shlok.roy@school.edu", "9700000027", "2005-03-31", "suspended", None, "Under investigation", today - timedelta(days=1)),
        ("S_028", "Tara Sengupta", "tara.sengupta@school.edu", "9700000028", "2006-07-04", "suspended", None, "Fee pending", today - timedelta(days=1)),
        ("S_029", "Parth Bansal", "parth.bansal@school.edu", "9700000029", "2005-10-12", "active", None, None, None),
        ("S_030", "Zara D'Souza", "zara.dsouza@school.edu", "9700000030", "2006-04-26", "active", None, None, None),
    ]

    for uid, name, email, phone, dob_str, status, b_by, b_reason, b_at in students_list:
        existing = db.query(Student).filter_by(u_id=uid).first()
        if not existing:
            dob_val = parse_date(dob_str)
            student = Student(
                u_id=uid,
                name=name,
                email=email,
                phone=phone,
                dob=dob_val,
                password=hash_password(dob_str),
                status=status,
                blocked_by=b_by,
                blocked_reason=b_reason,
                blocked_at=b_at,
                created_at=today - timedelta(days=60)
            )
            db.add(student)
    db.commit()

def seed_subjects(db):
    print("Seeding subjects (6 total)...")
    subjects = [
        (1, "Mathematics"),
        (2, "Physics"),
        (3, "Chemistry"),
        (4, "Computer Science"),
        (5, "English"),
        (6, "Biology"),
    ]

    for sub_id, name in subjects:
        existing = db.query(Subject).filter_by(subject_id=sub_id).first()
        if not existing:
            sub = Subject(subject_id=sub_id, subject_name=name)
            db.add(sub)
    db.commit()

def seed_attendance(db):
    print("Seeding attendance (last 30 days)...")
    if db.query(Attendance).count() > 0:
        print("Attendance already seeded.")
        return

    today = date.today()
    # Map student to faculty class
    def get_faculty_id(student_id: str) -> str:
        idx = int(student_id.split("_")[1])
        if idx <= 10:
            return "F_001"
        elif idx <= 20:
            return "F_002"
        else:
            return "F_003"

    students = db.query(Student).filter(Student.status == 'active').all()

    attendance_records = []
    for day_offset in range(30):
        current_date = today - timedelta(days=day_offset)
        # Skip Sunday (isoweekday == 7)
        if current_date.isoweekday() == 7:
            continue

        for st in students:
            fac_id = get_faculty_id(st.u_id)
            for sub_id in range(1, 7):
                # 85% chance present, 15% absent
                is_present = random.random() < 0.85
                status_val = "present" if is_present else "absent"
                attendance_records.append(Attendance(
                    student_id=st.u_id,
                    faculty_id=fac_id,
                    subject_id=sub_id,
                    date=current_date,
                    status=status_val
                ))

    db.bulk_save_objects(attendance_records)
    db.commit()
    print(f"Inserted {len(attendance_records)} attendance records.")

def seed_marks(db):
    print("Seeding marks...")
    if db.query(Marks).count() > 0:
        print("Marks already seeded.")
        return

    students = db.query(Student).filter(Student.status == 'active').all()
    toppers = {"S_001", "S_005", "S_012"}
    weak = {"S_020", "S_021", "S_022"}

    # Assign faculty per subject
    def get_subject_faculty(subject_id: int) -> str:
        if subject_id in (1, 2):
            return "F_001"
        elif subject_id in (3, 4):
            return "F_002"
        else:
            return "F_003"

    marks_records = []
    for st in students:
        for sub_id in range(1, 7):
            fac_id = get_subject_faculty(sub_id)
            if st.u_id in toppers:
                score = random.randint(85, 100)
            elif st.u_id in weak:
                score = random.randint(35, 55)
            else:
                score = random.randint(55, 85)

            marks_records.append(Marks(
                student_id=st.u_id,
                faculty_id=fac_id,
                subject_id=sub_id,
                marks_obtained=float(score),
                max_marks=100.0
            ))

    db.bulk_save_objects(marks_records)
    db.commit()
    print(f"Inserted {len(marks_records)} marks records.")

def seed_audit_log(db):
    print("Seeding audit log (20 entries)...")
    if db.query(AuditLog).count() > 0:
        print("AuditLog already seeded.")
        return

    today = date.today()
    logs = [
        {"actor_id": "A_001", "target_id": "F_006", "action": "BLOCK", "reason": "Repeated policy violations", "timestamp": today - timedelta(days=5)},
        {"actor_id": "A_001", "target_id": "S_025", "action": "BLOCK", "reason": "Attendance below 50%", "timestamp": today - timedelta(days=3)},
        {"actor_id": "A_002", "target_id": "S_026", "action": "BLOCK", "reason": "Disciplinary action", "timestamp": today - timedelta(days=2)},
        {"actor_id": "A_001", "target_id": "S_027", "action": "SUSPEND", "reason": "Under investigation", "timestamp": today - timedelta(days=1)},
        {"actor_id": "A_002", "target_id": "S_028", "action": "SUSPEND", "reason": "Fee pending", "timestamp": today - timedelta(days=1)},
        {"actor_id": "A_001", "target_id": "S_029", "action": "UNBLOCK", "reason": "Issue resolved", "timestamp": today},
        {"actor_id": "A_001", "target_id": "F_001", "action": "ADD_FACULTY", "reason": "New faculty onboarded", "timestamp": today - timedelta(days=30)},
        {"actor_id": "A_001", "target_id": "F_002", "action": "ADD_FACULTY", "reason": "New faculty onboarded", "timestamp": today - timedelta(days=30)},
        {"actor_id": "A_002", "target_id": "S_001", "action": "ADD_STUDENT", "reason": "Student enrollment", "timestamp": today - timedelta(days=25)},
        {"actor_id": "A_002", "target_id": "S_002", "action": "ADD_STUDENT", "reason": "Student enrollment", "timestamp": today - timedelta(days=25)},
        {"actor_id": "A_001", "target_id": "SUB_1", "action": "ADD_SUBJECT", "reason": "Curriculum update", "timestamp": today - timedelta(days=40)},
        {"actor_id": "A_001", "target_id": "SUB_2", "action": "ADD_SUBJECT", "reason": "Curriculum update", "timestamp": today - timedelta(days=40)},
        {"actor_id": "A_003", "target_id": "S_010", "action": "UPDATE_STUDENT", "reason": "Phone number updated", "timestamp": today - timedelta(days=10)},
        {"actor_id": "A_002", "target_id": "F_003", "action": "UPDATE_FACULTY", "reason": "Email updated", "timestamp": today - timedelta(days=8)},
        {"actor_id": "A_001", "target_id": "A_002", "action": "CREATE_ADMIN", "reason": "Assigned normal admin role", "timestamp": today - timedelta(days=45)},
        {"actor_id": "A_001", "target_id": "A_003", "action": "CREATE_ADMIN", "reason": "Assigned normal admin role", "timestamp": today - timedelta(days=45)},
        {"actor_id": "A_001", "target_id": "S_015", "action": "UPDATE_ATTENDANCE", "reason": "Medical leave excused", "timestamp": today - timedelta(days=4)},
        {"actor_id": "A_002", "target_id": "S_018", "action": "UPDATE_MARKS", "reason": "Re-evaluation mark updated", "timestamp": today - timedelta(days=2)},
        {"actor_id": "A_001", "target_id": "F_008", "action": "ADD_FACULTY", "reason": "Visiting professor registered", "timestamp": today - timedelta(days=15)},
        {"actor_id": "A_003", "target_id": "S_030", "action": "ADD_STUDENT", "reason": "Late admission approved", "timestamp": today - timedelta(days=5)},
    ]

    for entry in logs:
        log_obj = AuditLog(**entry)
        db.add(log_obj)
    db.commit()
    print("Inserted 20 audit log entries.")

def main():
    reset = "--reset" in sys.argv
    db = next(get_db())
    if reset:
        reset_all(db)
    seed_admins(db)
    seed_faculty(db)
    seed_students(db)
    seed_subjects(db)
    seed_attendance(db)
    seed_marks(db)
    seed_audit_log(db)
    print("\nDummy data seeded successfully.")
    print("Login credentials:")
    print("  Super Admin : A_001 / 2005-09-25")
    print("  Normal Admin: A_002 / 1990-03-14")
    print("  Faculty     : F_001 / 1985-05-20")
    print("  Student     : S_001 / 2005-08-15")

if __name__ == "__main__":
    main()
