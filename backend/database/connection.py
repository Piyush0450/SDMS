import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.models import Base

# Construct absolute path to sdms.sqlite3 in the SAME directory as this file (backend/database)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "sdms.sqlite3")
DATABASE_URL = f"sqlite:///{DB_PATH}"

print(f"--- ACTIVE DATABASE: {DB_PATH} ---")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()