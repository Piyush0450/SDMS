
from database.connection import SessionLocal
from models.models import Student
import bcrypt

def check_password(plain, hashed):
    return bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))

with SessionLocal() as db:
    u = db.query(Student).filter(Student.u_id == 'S_004').first()
    if u:
        print(f"User found: {u.u_id}")
        print(f"Stored Hash: {u.password}")
        print(f"DOB: {u.dob}")
        
        expected_pw = str(u.dob) # Using str(date) which is YYYY-MM-DD
        print(f"Expected Password (str(dob)): {expected_pw}")
        
        is_valid = check_password(expected_pw, u.password)
        print(f"Match with '{expected_pw}': {is_valid}")
        
        # Try other formats just in case
        formats = [
            u.dob.strftime('%d-%m-%Y'),
            u.dob.strftime('%m-%d-%Y'),
            u.dob.strftime('%d/%m/%Y'),
            u.dob.strftime('%m/%d/%Y'),
        ]
        
        for fmt in formats:
            if check_password(fmt, u.password):
                 print(f"MATCH FOUND with format '{fmt}'")
    else:
        print("User S_004 not found")
