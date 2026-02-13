from flask import Blueprint, request, jsonify
from database.connection import SessionLocal
from models.models import Admin, Faculty, Student
from firebase.auth import verify_token
import bcrypt
import jwt
import datetime

from config import Config

bp = Blueprint('auth', __name__, url_prefix='/api/auth')
SECRET_KEY = Config.SECRET_KEY

def check_password(plain, hashed):
    return bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))

@bp.post('/login')
def login_firebase():
    data = request.get_json()
    token = data.get('token')
    if not token: return jsonify({'error': 'Token missing'}), 400

    try:
        decoded_token = verify_token(token)
        email = decoded_token['email']
        
        with SessionLocal() as db:
            # Check in all tables
            from sqlalchemy import func
            email_lower = email.lower()
            
            user = db.query(Admin).filter(func.lower(Admin.email) == email_lower).first()
            role = 'admin'
            if not user:
                user = db.query(Faculty).filter(func.lower(Faculty.email) == email_lower).first()
                role = 'faculty'
            if not user:
                user = db.query(Student).filter(func.lower(Student.email) == email_lower).first()
                role = 'student'
            
            if not user:
                return jsonify({'ok': False, 'error': 'User not found'}), 404

            # Check for blocked status
            if hasattr(user, 'status') and user.status in ['blocked', 'suspended']:
                return jsonify({'ok': False, 'error': 'Your account has been blocked. Contact the administrator.'}), 403

            # Return session info
            return jsonify({
                'ok': True,
                'role': 'super_admin' if role == 'admin' and user.admin_type == 'super' else role,
                'id': user.u_id,
                'email': user.email
            })

    except Exception as e:
        return jsonify({'error': str(e)}), 401

@bp.post('/login/credentials')
def login_credentials():
    data = request.get_json()
    uid = data.get('username') # Looking for u_id
    password = data.get('password') # DOB usually

    if not uid or not password:
        return jsonify({'error': 'Missing credentials'}), 400

    with SessionLocal() as db:
        user = db.query(Admin).filter(Admin.u_id == uid).first()
        role = 'admin'
        if not user:
            user = db.query(Faculty).filter(Faculty.u_id == uid).first()
            role = 'faculty'
        if not user:
            user = db.query(Student).filter(Student.u_id == uid).first()
            role = 'student'

        if not user or not check_password(password, user.password):
            return jsonify({'ok': False, 'error': 'Invalid credentials'}), 401
        
        # Check for blocked status
        if hasattr(user, 'status') and user.status in ['blocked', 'suspended']:
            return jsonify({'ok': False, 'error': 'Your account has been blocked. Contact the administrator.'}), 403
        
        return jsonify({
            'ok': True,
            'role': 'super_admin' if role == 'admin' and user.admin_type == 'super' else role,
            'id': user.u_id,
            'email': user.email
        })
