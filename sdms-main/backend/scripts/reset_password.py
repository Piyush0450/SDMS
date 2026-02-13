
import sys
import os
import bcrypt

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from database.connection import SessionLocal
from models.models import Faculty

def reset():
    db = SessionLocal()
    f = db.query(Faculty).filter_by(u_id="F_001").first()
    if f:
        print(f"Found F_001. Resetting password...")
        f.password = bcrypt.hashpw("password".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        db.commit()
        print("Password reset to 'password'")
    else:
        print("F_001 not found.")
    db.close()

if __name__ == "__main__":
    reset()
