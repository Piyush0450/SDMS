import sqlite3

conn = sqlite3.connect('sdms.sqlite3')
cursor = conn.cursor()

print("--- Checking Marks Table ---")
cursor.execute("SELECT * FROM marks")
rows = cursor.fetchall()
if not rows:
    print("No marks found.")
else:
    for row in rows:
        print(row)

print("\n--- Checking Attendance Table ---")
cursor.execute("SELECT * FROM attendance")
rows = cursor.fetchall()
if not rows:
    print("No attendance records found.")
else:
    for row in rows:
        print(row)

conn.close()
