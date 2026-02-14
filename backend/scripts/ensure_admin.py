"""
Simple script to seed the database using seed.sql file.
This runs on every deployment to ensure the admin user exists.
"""
import os
from database.connection import Base, engine, SessionLocal
from models.user import User, Admin
from sqlalchemy import select, text

def ensure_admin_user():
    """Execute seed.sql to ensure admin user exists. Safe for deployment."""
    try:
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
            
            with open(seed_file_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()

            # Filter out comments and empty lines, then join back
            clean_lines = [line for line in lines if line.strip() and not line.strip().startswith('--')]
            sql_content = ''.join(clean_lines)
            
            # Split by semicolons and execute each statement
            statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]
            
            for statement in statements:
                try:
                    db.execute(text(statement))
                except Exception as stmt_err:
                    print(f"⚠️ Error executing statement: {statement[:50]}... -> {stmt_err}")
                    # Continue attempting other statements or fail? 
                    # For seeding, usually safe to continue or abort. usage of rollback below covers it.
                    raise stmt_err
            
            db.commit()
            print("✅ Database seeded successfully from seed.sql")
            
    except Exception as e:
        # Log error but DO NOT crash the deployment
        print(f"❌ Error in ensure_admin_user: {e}")
        print("⚠️ Deployment continuing without seeding...")

if __name__ == "__main__":
    ensure_admin_user()
