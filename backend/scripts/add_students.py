import sys
import os
import bcrypt
from datetime import date

# Add the parent directory to sys.path to allow imports from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.connection import SessionLocal
from models.models import Student

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def add_students():
    db = SessionLocal()
    try:
        print("Starting student creation...")
        
        students_data = [
            {"u_id": "S_002", "name": "Rahul Sharma", "email": "rahul.sharma@example.com", "phone": "9876543202", "dob": date(2005, 1, 15)},
            {"u_id": "S_003", "name": "Ananya Gupta", "email": "ananya.gupta@example.com", "phone": "9876543203", "dob": date(2005, 3, 22)},
            {"u_id": "S_004", "name": "Vikram Singh", "email": "vikram.singh@example.com", "phone": "9876543204", "dob": date(2004, 11, 10)},
            {"u_id": "S_005", "name": "Neha Patel", "email": "neha.patel@example.com", "phone": "9876543205", "dob": date(2005, 7, 5)},
            {"u_id": "S_006", "name": "Arjun Das", "email": "arjun.das@example.com", "phone": "9876543206", "dob": date(2004, 5, 20)},
        ]
        
        default_password = "password123"
        hashed_pw = hash_password(default_password)
        
        for s_data in students_data:
            existing = db.get(Student, s_data["u_id"])
            if existing:
                print(f"Student {s_data['u_id']} already exists. Skipping.")
                continue
                
            new_student = Student(
                u_id=s_data["u_id"],
                name=s_data["name"],
                email=s_data["email"],
                phone=s_data["phone"],
                dob=s_data["dob"],
                password=hashed_pw
            )
            db.add(new_student)
            print(f"Added student: {s_data['name']} ({s_data['u_id']})")
            
        db.commit()
        print("Successfully added students.")
        
    except Exception as e:
        db.rollback()
        print(f"Error adding students: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    add_students()
