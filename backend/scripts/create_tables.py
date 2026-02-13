# backend/scripts/create_tables.py
"""
Run this from backend folder:
    python -m scripts.create_tables
"""

import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(ROOT))

from database.connection import engine, Base
import models.user  # make sure models register with Base

def main():
    print("Creating tables in MySQL...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

if __name__ == "__main__":
    main()