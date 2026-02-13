import sqlite3
import os

# Point to the CORRECT database
DB_PATH = '../database/sdms.sqlite3'

def verify_all():
    print(f"Checking database at: {os.path.abspath(DB_PATH)}")
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        tables = ['admin', 'faculty', 'student']
        required_columns = ['status', 'blocked_by', 'blocked_reason', 'blocked_at', 'unblock_at']
        
        for table in tables:
            print(f"--- Table: {table} ---")
            cursor.execute(f"PRAGMA table_info({table})")
            cols = [info[1] for info in cursor.fetchall()]
            print(f"Columns: {cols}")
            
            missing = [c for c in required_columns if c not in cols]
            if missing:
                print(f"❌ MISSING: {missing}")
            else:
                print("✅ All required columns present.")
            print("")
            
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    verify_all()
