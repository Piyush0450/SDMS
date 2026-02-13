from database.connection import engine, SessionLocal
from models.models import Base, Admin, Faculty, Student, Subject
from datetime import date
import bcrypt

# Create Tables
Base.metadata.create_all(bind=engine)

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def seed():
    db = SessionLocal()
    
    # ----------------------------------------------------
    # STRICT MANDATORY SEED: SUPER ADMIN A_001
    # ----------------------------------------------------
    try:
        super_admin_id = "A_001"
        target_data = {
            # "name": "Piyush Chaurasiya",
            # "admin_type": "super",
            # "email": "Piyushchaurasiya348@gmail.com",
            # "dob": date(2005, 9, 25),
            # "password": hash_password("2005-09-25")

            "name": "Prinshu Gupta",
            "admin_type": "super",
            "email": "Prinshug448@gmail.com",
            "dob": date(2006, 1, 3),
            "password": hash_password("2006-01-03")
        }

        existing_admin = db.query(Admin).filter_by(u_id=super_admin_id).first()

        if not existing_admin:
            print(f"Creating Super Admin {super_admin_id}...")
            new_admin = Admin(u_id=super_admin_id, **target_data)
            db.add(new_admin)
        else:
            # Check if update needed
            needs_update = False
            if existing_admin.name != target_data["name"] or \
               existing_admin.email != target_data["email"] or \
               existing_admin.dob != target_data["dob"] or \
               existing_admin.admin_type != target_data["admin_type"]:
               # Password check is hard due to hashing, so we re-hash if other fields change or force update
               needs_update = True
            
            if needs_update:
                print(f"Updating Super Admin {super_admin_id} to match strict config...")
                existing_admin.name = target_data["name"]
                existing_admin.email = target_data["email"]
                existing_admin.dob = target_data["dob"]
                existing_admin.admin_type = target_data["admin_type"]
                existing_admin.password = target_data["password"]

        # ----------------------------------------------------
        # Optional: Seed other data only if empty (Start of project)
        # ----------------------------------------------------
        if not db.query(Subject).first():
            subjects = ["Mathematics", "Physics", "Chemistry", "Computer Science", "English"]
            for s in subjects:
                db.add(Subject(subject_name=s))
        
        if not db.query(Faculty).first():
            db.add(Faculty(u_id="F_001", name="John Doe", email="faculty@school.edu", phone="9876543211", dob=date(1985, 5, 20), password=hash_password("1985-05-20")))

        if not db.query(Student).first():
            db.add(Student(u_id="S_001", name="Jane Smith", email="student@school.edu", phone="9876543201", dob=date(2005, 8, 15), password=hash_password("2005-08-15")))

        db.commit()
        print("Seeding logic completed successfully.")
    
    except Exception as e:
        print(f"Seeding failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
