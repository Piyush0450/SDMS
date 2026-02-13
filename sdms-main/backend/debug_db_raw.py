import sqlite3
import os

DB_PATH = 'database/sdms.sqlite3'

if not os.path.exists(DB_PATH):
    print(f"Database file not found at {DB_PATH}")
    exit(1)

try:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check tables
    print("Tables:")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    for t in tables:
        print(f"- {t[0]}")
        
    # Check Student S_001
    print("\nChecking Student S_001:")
    try:
        cursor.execute("SELECT u_id, name, dob, password, status FROM student WHERE u_id='S_001'")
        row = cursor.fetchone()
        if row:
            print(f"Found: {row}")
        else:
            print("Student S_001 not found.")
    except Exception as e:
        print(f"Error querying student: {e}")

    conn.close()
except Exception as e:
    print(f"DB Error: {e}")
