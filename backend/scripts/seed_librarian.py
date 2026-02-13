import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database.connection import SessionLocal
from models.user import Librarian, User
from models import user, academic, department, activity, finance, library  # noqa: F401
from datetime import date

def seed_librarian():
    with SessionLocal() as db:
        # Check if librarian already exists
        existing = db.query(Librarian).filter(Librarian.librarian_uid == 'L_001').first()
        if existing:
            print("Librarian L_001 already exists")
            return
        
        # Create sample librarian
        librarian = Librarian(
            librarian_uid='L_001',
            name='Rajesh Kumar',
            email='librarian@school.edu',
            phone='9876543210',
            date_of_birth=date(1985, 5, 15),
            gender='Male',
            address='Library Block, School Campus',
            joining_date=date(2020, 1, 1)
        )
        
        db.add(librarian)
        db.commit()
        print(f"[OK] Created librarian: {librarian.name} ({librarian.librarian_uid})")
        
        # Add to User table for authentication
        user = User(
            email=librarian.email,
            role='librarian',
            related_id=librarian.librarian_uid
        )
        db.add(user)
        db.commit()
        print(f"[OK] Added {librarian.email} to users table with role 'librarian'")

if __name__ == '__main__':
    seed_librarian()
    print("\n[SUCCESS] Librarian seeding complete!")
