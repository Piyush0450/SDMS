import requests
import sqlite3

# Verify subject exists first
conn = sqlite3.connect('database/sdms.sqlite3')
cursor = conn.cursor()
cursor.execute("INSERT OR IGNORE INTO subject (subject_name) VALUES ('Mathematics')")
conn.commit()
row = cursor.execute("SELECT subject_id FROM subject WHERE subject_name='Mathematics'").fetchone()
subject_id = row[0]
conn.close()

print(f"Using Subject ID: {subject_id}")

url = 'http://127.0.0.1:5000/api/faculty/results'
payload = {
    "faculty_id": "F_001",
    "subject_id": str(subject_id),
    "marksMap": {
        "S_001": 99.9
    },
    "max_marks": 100
}

print("Sending payload:", payload)
try:
    resp = requests.post(url, json=payload)
    print("Response Status:", resp.status_code)
    print("Response Body:", resp.text)
except Exception as e:
    print("Request failed:", e)

# Check DB immediately
conn = sqlite3.connect('database/sdms.sqlite3')
cursor = conn.cursor()
rows = cursor.execute("SELECT * FROM marks WHERE faculty_id='F_001' AND student_id='S_001'").fetchall()
print("\n--- DB Check ---")
if rows:
    print("SUCCESS: Data found in DB:", rows)
else:
    print("FAILURE: No data found in DB.")
conn.close()
