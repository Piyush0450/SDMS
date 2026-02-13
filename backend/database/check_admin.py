import sqlite3
import os

DB_PATH = "sdms.sqlite3"

def check_admin():
    if not os.path.exists(DB_PATH):
        print(f"Error: {DB_PATH} not found.")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print("--- Checking 'admin' table for A_001 ---")
    try:
        cursor.execute("SELECT * FROM admin WHERE u_id = 'A_001'")
        row = cursor.fetchone()
        if row:
            print("FOUND:", row)
        else:
            print("NOT FOUND: A_001 is missing.")
            
        print("\n--- All Admins ---")
        cursor.execute("SELECT * FROM admin")
        rows = cursor.fetchall()
        for r in rows:
            print(r)
            
    except sqlite3.Error as e:
        print(f"SQL Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_admin()
