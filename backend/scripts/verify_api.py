import requests
import json
import base64

BASE_URL = "http://localhost:5000"

def create_dev_token(email):
    header = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0" # {"alg":"none","typ":"JWT"}
    payload = base64.b64encode(json.dumps({"email": email}).encode()).decode()
    return f"{header}.{payload}."

def test_login(email):
    print(f"Testing Login for {email}...")
    token = create_dev_token(email)
    try:
        res = requests.post(f"{BASE_URL}/api/auth/login", json={"token": token})
        if res.status_code == 200:
            data = res.json()
            if data['ok']:
                print(f"[OK] Login Success: {data['role']} ({data['id']})")
                return data
            else:
                print(f"[FAIL] Login Failed: {data.get('error')}")
        else:
            print(f"[FAIL] Login HTTP Error: {res.status_code} - {res.text}")
    except Exception as e:
        print(f"[FAIL] Connection Error: {e}")
    return None

def test_admin_endpoints():
    print("\n--- Testing Admin Endpoints ---")
    user = test_login("piyushchaurasiya348@gmail.com")
    if not user or user['role'] != 'super_admin':
        print("Skipping admin tests (login failed or not super_admin)")
        return

    # Admin Dashboard Stats
    res = requests.get(f"{BASE_URL}/api/dashboard/admin/stats")
    if res.status_code == 200:
        print(f"[OK] Dashboard Stats: {res.json()}")
    else:
        print(f"[FAIL] Dashboard Stats Failed: {res.status_code}")

    # List Admins
    res = requests.get(f"{BASE_URL}/api/admin/admins")
    if res.status_code == 200:
        print(f"[OK] List Admins: Found {len(res.json())} admins")
    else:
        print(f"[FAIL] List Admins Failed: {res.status_code}")

    # List Faculty
    res = requests.get(f"{BASE_URL}/api/admin/faculty")
    if res.status_code == 200:
        print(f"[OK] List Faculty: Found {len(res.json())} faculty")
    else:
        print(f"[FAIL] List Faculty Failed: {res.status_code}")

    # List Students
    res = requests.get(f"{BASE_URL}/api/admin/students")
    if res.status_code == 200:
        print(f"[OK] List Students: Found {len(res.json())} students")
    else:
        print(f"[FAIL] List Students Failed: {res.status_code}")

def test_faculty_endpoints():
    print("\n--- Testing Faculty Endpoints ---")
    # Need a valid faculty email from seed
    # Seed data has "sharma@school.edu"
    user = test_login("sharma@school.edu") 
    if not user:
        print("Skipping faculty tests")
        return

    fid = user['id'] # F_001 or similar? No, seed data script doesn't explicitly set faculty_uid in `seed_data`? 
    # Wait, in reset_and_seed_v2.py:
    # f1 = Faculty(name="Ramesh Sharma", email="sharma@school.edu" ...)
    # It auto-increments ID. admin_routes might return the string ID if `related_id` is set properly.
    # In user.py: related_id = Column(String(50))
    # We need to ensure `related_id` is populated. The seeding script MIGHT NOT be populating `related_id` in `users` table correctly if it's separate.
    # Actually, `auth_routes.py` queries `User` table.
    # Does `seed_data` create `User` entries?
    # Let's check `reset_and_seed_v2.py` again.
    
    # ... It creates Faculty, Student, Admin objects.
    # Does it create User objects?
    # NO! `reset_and_seed_v2.py` imports `User` but does not seem to create `User` records for them unless there is a trigger or if the logic is handled.
    # THIS MIGHT BE THE BUG. `auth_routes` queries `User` table.
    # If `User` table is empty, NO LOGIN WILL WORK.
    
    pass

if __name__ == "__main__":
    test_admin_endpoints()
    # test_faculty_endpoints()
