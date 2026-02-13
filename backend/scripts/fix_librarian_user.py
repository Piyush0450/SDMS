import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database.connection import SessionLocal
from models.user import Librarian, User
from models import user, academic, department, activity, finance, library  # noqa: F401

def add_librarian_to_users():
    with SessionLocal() as db:
        # Get the librarian
        librarian = db.query(Librarian).filter(Librarian.librarian_uid == 'L_001').first()
        if not librarian:
            print("Librarian L_001 not found")
            return
        
        # Check if already in User table
        existing_user = db.query(User).filter(User.email == librarian.email).first()
        if existing_user:
            print(f"User already exists for {librarian.email}")
            return
        
        # Add to User table
        user = User(
            email=librarian.email,
            role='librarian',
            related_id=librarian.librarian_uid
        )
        db.add(user)
        db.commit()
        print(f"[OK] Added {librarian.email} to User table with role 'librarian'")

if __name__ == '__main__':
    add_librarian_to_users()
    print("\n[SUCCESS] Librarian added to User table!")
