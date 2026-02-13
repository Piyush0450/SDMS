
import sys
import os

# Add parent dir to path
sys.path.append(os.getcwd())

from flask import Flask
from database.connection import SessionLocal
from models.models import Student, Admin, Faculty
from routes.auth_routes import bp
from config import Config
import json

app = Flask(__name__)
app.config.from_object(Config)
app.register_blueprint(bp)

def test_login_routes():
    with SessionLocal() as db:
        # Get a test student
        student = db.query(Student).first()
        if not student:
            print("No student found in DB for testing.")
            return
        
        print(f"Testing with Student: {student.u_id}, email: {student.email}")
        
        with app.test_client() as client:
            # 1. Test UID Login (Credentials)
            print("\n--- Testing UID Login ---")
            res = client.post('/api/auth/login', json={'username': student.u_id})
            print(f"Missing password status: {res.status_code}") # Should be 400
            
            # 2. Test Google Login (Simulation)
            print("\n--- Testing Google Login ---")
            # We use a fake token. verify_token in auth.py falls back to jwt.decode(verify=False)
            import jwt
            fake_token = jwt.encode({'email': student.email}, 'secret', algorithm='HS256')
            
            res = client.post('/api/auth/login', json={'token': fake_token})
            print(f"Google Login status: {res.status_code}")
            data = res.get_json()
            if data and data.get('ok'):
                print(f"SUCCESS: Logged in as {data.get('u_id')} with role {data.get('role')}")
            else:
                print(f"FAILURE: {data.get('error') if data else 'Unknown error'}")

if __name__ == "__main__":
    test_login_routes()
