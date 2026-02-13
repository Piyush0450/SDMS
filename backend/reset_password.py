
from database.connection import SessionLocal
from models.models import Student
import bcrypt

def hash_pw(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

with SessionLocal() as db:
    u = db.query(Student).filter(Student.u_id == 'S_004').first()
    if u:
        print(f"Resetting password for {u.u_id}...")
        new_pw_plain = "2004-11-10"
        u.password = hash_pw(new_pw_plain)
        db.commit()
        print(f"Password reset to hash of '{new_pw_plain}'")
    else:
        print("User S_004 not found")
