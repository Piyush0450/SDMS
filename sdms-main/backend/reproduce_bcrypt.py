import sys

try:
    import bcrypt
    print(f"bcrypt imported from: {bcrypt.__file__}")
except ImportError as e:
    print(f"Failed to import bcrypt: {e}")
    sys.exit(1)

data = {'dob': '2000-01-01'}

def hash_pw(password):
    # This is the line from admin_routes.py
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


try:
    print(f"Hashing '{data['dob']}'...")
    res = hash_pw(data['dob'])
    print(f"Success: {res}")
except Exception as e:
    print(f"Error with valid date: {type(e).__name__}: {e}")

# Test Case 2: None
try:
    print("Testing hash_pw(None)...")
    hash_pw(None)
except Exception as e:
    print(f"Error hash_pw(None): {type(e).__name__}: {e}")

# Test Case 3: Integer
try:
    print("Testing hash_pw(123)...")
    hash_pw(123)
except Exception as e:
    print(f"Error hash_pw(123): {type(e).__name__}: {e}")

# Test Case 4: strptime(None)
from datetime import datetime
try:
    print("Testing strptime(None)...")
    datetime.strptime(None, '%Y-%m-%d')
except Exception as e:
    print(f"Error strptime(None): {type(e).__name__}: {e}")

