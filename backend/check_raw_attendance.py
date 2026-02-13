
import sqlite3

def check_raw_attendance():
    conn = sqlite3.connect('database/sdms.sqlite3')
    cursor = conn.cursor()
    
    print("Checking raw attendance data...")
    cursor.execute("SELECT id, student_id, status FROM attendance LIMIT 10")
    rows = cursor.fetchall()
    
    for row in rows:
        print(f"ID: {row[0]}, Student: {row[1]}, Status: '{row[2]}'")

if __name__ == "__main__":
    check_raw_attendance()
