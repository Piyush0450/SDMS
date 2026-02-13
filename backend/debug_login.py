from database.connection import SessionLocal
from models.models import Student
import bcrypt

def check_student_credentials(uid, input_password):
    db = SessionLocal()
    try:
        user = db.query(Student).filter(Student.u_id == uid).first()
        
        if not user:
            print(f"User {uid} NOT FOUND in database.")
            return

        print(f"User Found: {user.name}")
        print(f"Email: {user.email}")
        print(f"DOB (Stored): {user.dob}")
        print(f"Password Hash (Stored): {user.password}")

        # Check Password
        try:
            is_valid = bcrypt.checkpw(input_password.encode('utf-8'), user.password.encode('utf-8'))
            print(f"Password Check ('{input_password}'): {'PASSED' if is_valid else 'FAILED'}")
        except Exception as e:
            print(f"Error checking password: {e}")

    finally:
        db.close()

if __name__ == "__main__":
    # Test with the input from the screenshot
    check_student_credentials("S_001", "2005-08-15")
