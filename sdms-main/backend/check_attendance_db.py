
from database.connection import SessionLocal
from models.models import Attendance, Student
from sqlalchemy import select

def check_attendance():
    uid = 's_001' # Checking for lowercase first as that's what user likely sees or is logged in as if consistent with previous
    uid_upper = 'S_001'
    
    with SessionLocal() as db:
        print(f"Checking for Student {uid}...")
        records = db.scalars(select(Attendance).where(Attendance.student_id == uid)).all()
        print(f"Found {len(records)} records for {uid}")
        
        print(f"Checking for Student {uid_upper}...")
        records_upper = db.scalars(select(Attendance).where(Attendance.student_id == uid_upper)).all()
        print(f"Found {len(records_upper)} records for {uid_upper}")
        
        if records_upper:
            print("Sample Record:", records_upper[0].date, records_upper[0].status, records_upper[0].subject_id)

if __name__ == "__main__":
    check_attendance()
