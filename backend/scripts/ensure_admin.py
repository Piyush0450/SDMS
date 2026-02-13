"""
Simple script to seed the database using seed.sql file.
This runs on every deployment to ensure the admin user exists.
"""
import os
from database.connection import Base, engine, SessionLocal
from models.user import User, Admin
from sqlalchemy import select, text

def ensure_admin_user():
    """Execute seed.sql to ensure admin user exists."""
    
    # Create all tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    with SessionLocal() as db:
        # Check if super admin user already exists
        existing_user = db.scalars(
            select(User).where(User.email == "piyushchaurasiya348@gmail.com")
        ).first()
        
        if existing_user:
            print("✅ Super admin user already exists")
            return
        
        # Read and execute seed.sql
        seed_file_path = os.path.join(os.path.dirname(__file__), '..', 'database', 'seed.sql')
        
        if not os.path.exists(seed_file_path):
            print(f"⚠️ Warning: seed.sql not found at {seed_file_path}")
            return
        
        try:
            with open(seed_file_path, 'r', encoding='utf-8') as f:
                sql_content = f.read()
            
            # Split by semicolons and execute each statement
            statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip() and not stmt.strip().startswith('--')]
            
            for statement in statements:
                if statement:
                    db.execute(text(statement))
            
            db.commit()
            print("✅ Database seeded successfully from seed.sql")
            print("   📧 Email: piyushchaurasiya348@gmail.com")
            print("   🔑 Role: super_admin")
            
        except Exception as e:
            db.rollback()
            print(f"❌ Error seeding database: {e}")
            raise

if __name__ == "__main__":
    ensure_admin_user()
