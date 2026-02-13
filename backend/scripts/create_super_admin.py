
import sys
import os
import bcrypt
from datetime import date
from sqlalchemy import func

# Add backend directory to sys.path to allow imports
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from database.connection import SessionLocal
from models.models import Admin

def create_super_admin():
    session = SessionLocal()
    try:
        email = "prinshug448@gmail.com"
        # Check if user already exists
        existing_user = session.query(Admin).filter(func.lower(Admin.email) == email.lower()).first()
        if existing_user:
            print(f"User with email {email} already exists as {existing_user.u_id}.")
            return

        # Generate new UID
        # Assuming UIDs are in format A_XXX
        last_admin = session.query(Admin).order_by(Admin.u_id.desc()).first()
        if last_admin and last_admin.u_id.startswith('A_'):
            try:
                last_id_num = int(last_admin.u_id.split('_')[1])
                new_id_num = last_id_num + 1
            except ValueError:
                new_id_num = 1 # Fallback
        else:
            new_id_num = 1
        
        new_uid = f"A_{new_id_num:03d}"
        
        # Prepare data
        name = "Prins Hug" # derived from email
        dob = date(2000, 1, 1)
        dob_str = dob.strftime('%Y-%m-%d')
        password_plain = dob_str # Password is DOB
        hashed_password = bcrypt.hashpw(password_plain.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        new_admin = Admin(
            u_id=new_uid,
            name=name,
            admin_type='super',
            email=email,
            phone='0000000000',
            dob=dob,
            password=hashed_password,
            status='active'
        )
        
        session.add(new_admin)
        session.commit()
        print(f"Successfully created Super Admin:")
        print(f"UID: {new_uid}")
        print(f"Email: {email}")
        print(f"Password: {dob_str}")
        
    except Exception as e:
        session.rollback()
        print(f"Error creating user: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    create_super_admin()
