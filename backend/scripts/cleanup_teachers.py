import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database.connection import engine
from sqlalchemy import text

def drop_teachers():
    with engine.connect() as conn:
        print("Dropping orphaned 'teachers' table...")
        conn.execute(text("DROP TABLE IF EXISTS teachers"))
        conn.commit()
        print("Dropped 'teachers'.")

if __name__ == "__main__":
    drop_teachers()
