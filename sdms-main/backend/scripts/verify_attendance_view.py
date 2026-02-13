
import json
import sys
import os

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app
from datetime import date

def run_test():
    client = app.test_client()
    
    # 1. Login
    print("Logging in as F_001...")
    res = client.post('/api/auth/login/credentials', json={"username": "F_001", "password": "password"})
    if res.status_code != 200:
        print(f"Login Failed: {res.data}")
        return
    
    # Cookie is handled by client automatically? Flask test_client handles cookies if we use the same client instance?
    # Actually Flask 2.x test_client manages cookies, but our auth uses a TOKEN in the header (if following the middleware logic).
    # Wait, `auth_middleware.py` uses `request.headers.get('Authorization')`?
    # Let's check `auth_middleware.py`.
    # AND `login` endpoint returns a token?
    # `auth_routes.py` `login` returns `{ ..., token: ... }`?
    # If using Session/Cookies, client keeps it.
    
    data = res.get_json()
    token = data.get('token') # Check if token is returned.
    # If token exists, we must send it in headers.
    
    headers = {}
    if token:
        headers['Authorization'] = f"Bearer {token}"
        print("Token obtained.")
    else:
        # Maybe it uses session?
        print("No token returned, assuming session or cookie.")

    # 2. Mark Attendance
    today = str(date.today())
    print(f"Marking attendance for {today}...")
    payload = {
        "faculty_id": "F_001",
        "subject_id": 1,
        "date": today,
        "statusMap": {
            "S_001": "present"
        }
    }
    res = client.post('/api/faculty/attendance', json=payload, headers=headers)
    print(f"Mark Response: {res.status_code} {res.get_json()}")
    
    # 3. View Attendance
    print("Fetching attendance...")
    res = client.get(f'/api/faculty/attendance?subject_id=1&date={today}', headers=headers)
    print(f"Get Attendance Response: {res.status_code} {res.get_json()}")
    
    if res.status_code == 200:
        d = res.get_json()
        if d.get("S_001") == "present":
            print("SUCCESS: Attendance fetched correctly.")
        else:
            print(f"FAILURE: Attendance data mismatch: {d}")
    else:
        print("FAILURE: Could not fetch attendance.")

    # 4. Try to re-mark
    print("Attempting to re-mark attendance (should fail)...")
    payload2 = {
        "faculty_id": "F_001",
        "subject_id": 1,
        "date": today,
        "statusMap": {
            "S_001": "absent"
        }
    }
    res = client.post('/api/faculty/attendance', json=payload2, headers=headers)
    print(f"Re-mark Response: {res.status_code} {res.get_json()}")
    if res.status_code == 400 and "already marked" in (res.get_json() or {}).get('error', ''):
         print("SUCCESS: Prevented re-marking.")
    else:
         print("FAILURE: Re-marking was allowed or wrong error.")

    # 5. Marks Validation
    print("Attempting to upload invalid marks (>100)...")
    payload_marks = {
        "faculty_id": "F_001",
        "subject_id": 1,
        "marksMap": { "S_001": 150 },
        "max_marks": 100
    }
    res = client.post('/api/faculty/results', json=payload_marks, headers=headers)
    print(f"Invalid Marks Response: {res.status_code} {res.get_json()}")
    err_msg = (res.get_json() or {}).get('error', '')
    if res.status_code == 400 and "between 0 and 100" in err_msg:
        print("SUCCESS: Invalid marks rejected.")
    else:
        print("FAILURE: Invalid marks accepted.")

    # 6. Upload Valid Marks
    print("Uploading valid marks...")
    payload_marks["marksMap"]["S_001"] = 85
    res = client.post('/api/faculty/results', json=payload_marks, headers=headers)
    print(f"Valid Marks Response: {res.status_code} {res.get_json()}")
    
    # 7. Try to change Marks
    print("Attempting to change marks (should fail)...")
    payload_marks["marksMap"]["S_001"] = 90
    res = client.post('/api/faculty/results', json=payload_marks, headers=headers)
    print(f"Re-upload Marks Response: {res.status_code} {res.get_json()}")
    err_msg = (res.get_json() or {}).get('error', '')
    if res.status_code == 400 and "already entered" in err_msg:
        print("SUCCESS: Prevented marks update.")
    else:
        print("FAILURE: Marks update allowed.")

if __name__ == "__main__":
    run_test()
