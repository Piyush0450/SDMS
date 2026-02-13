
from database.connection import SessionLocal
from models.models import Admin, Faculty, Student
import bcrypt

def hash_pw(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def fix_passwords():
    db = SessionLocal()
    try:
        print("Starting bulk password update...")
        
        # 1. Admins
        admins = db.query(Admin).all()
        for a in admins:
            if a.dob:
                dob_str = a.dob.strftime('%Y-%m-%d')
                print(f"Updating Admin {a.u_id} pw to {dob_str}")
                a.password = hash_pw(dob_str)
        
        # 2. Faculty
        faculty = db.query(Faculty).all()
        for f in faculty:
            if f.dob:
                dob_str = f.dob.strftime('%Y-%m-%d')
                print(f"Updating Faculty {f.u_id} pw to {dob_str}")
                f.password = hash_pw(dob_str)
                
        # 3. Students
        students = db.query(Student).all()
        for s in students:
            if s.dob:
                dob_str = s.dob.strftime('%Y-%m-%d')
                print(f"Updating Student {s.u_id} pw to {dob_str}")
                s.password = hash_pw(dob_str)
        
        db.commit()
        print("All passwords updated successfully to match DOB (YYYY-MM-DD).")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_passwords()
