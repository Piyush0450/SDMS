from flask import Flask, jsonify
from flask_cors import CORS
from database.connection import Base, engine
from firebase_admin import credentials, initialize_app
import os

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Initialize Database Tables
Base.metadata.create_all(bind=engine)

# Startup Checks
from utils.startup_checks import check_schema
check_schema()

# Auto-Seed Logic (Strict)
from database.seed import seed
seed()

# Initialize Firebase
# Initialize Firebase
try:
    # 1. Try Environment Variable (Render/Production)
    firebase_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")
    if firebase_json:
        import json
        cred_dict = json.loads(firebase_json)
        cred = credentials.Certificate(cred_dict)
        initialize_app(cred)
        print("Firebase Initialized via Environment Variable")
    # 2. Try Local File (Dev)
    elif os.path.exists("firebase/serviceAccountKey.json"):
        cred = credentials.Certificate("firebase/serviceAccountKey.json")
        initialize_app(cred)
        print("Firebase Initialized via Local File")
    else:
        print("Warning: firebase/serviceAccountKey.json not found and FIREBASE_SERVICE_ACCOUNT_JSON not set. Firebase Auth will fail.")
except Exception as e:
    print(f"Failed to initialize Firebase: {e}")

# Import Routes
from routes import auth_routes, admin_routes, faculty_routes, student_routes, dashboard_routes

# Register Blueprints
app.register_blueprint(auth_routes.bp)
app.register_blueprint(admin_routes.bp)
app.register_blueprint(faculty_routes.bp)
app.register_blueprint(student_routes.bp)
app.register_blueprint(dashboard_routes.bp)

@app.route('/')
def home():
    return jsonify({"message": "SDMS Backend Running (Fixed Deploy)"})

def create_app():
    return app

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
