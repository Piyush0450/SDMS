from flask import Blueprint, request, jsonify
from database.connection import SessionLocal
from models.models import Admin, Faculty, Student
from config import Config
from blacklist import BLACKLIST
import bcrypt
import jwt
import datetime
from sqlalchemy import func, select, or_
from firebase.auth import verify_token

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

def check_password(plain, hashed):
    """Verify password against bcrypt hash."""
    return bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))

@bp.post('/login')
def login():
    """
    Unified Login Endpoint.
    If 'token' is present -> Google Auth logic.
    If 'username' or 'u_id' is present -> Credential Auth logic.
    """
    data = request.get_json()
    
    # 1. Google Auth Case
    if 'token' in data:
        token = data.get('token')
        decoded_token = verify_token(token)
        if not decoded_token:
            return jsonify({'ok': False, 'error': 'Invalid or expired token'}), 401

        email = decoded_token.get('email')
        if not email:
            return jsonify({'ok': False, 'error': 'Email not found in token'}), 400

        with SessionLocal() as db:
            user = None
            role = None

            # Check Admin -> Faculty -> Student by email
            user = db.scalar(select(Admin).where(func.lower(Admin.email) == email.lower()))
            if user:
                role = 'super_admin' if user.admin_type == 'super' else 'admin'
            
            if not user:
                user = db.scalar(select(Faculty).where(func.lower(Faculty.email) == email.lower()))
                if user: role = 'faculty'
                
            if not user:
                user = db.scalar(select(Student).where(func.lower(Student.email) == email.lower()))
                if user: role = 'student'

            if not user:
                return jsonify({'ok': False, 'error': 'User not found with this email'}), 404

            if hasattr(user, 'status') and user.status == 'blocked':
                 return jsonify({'ok': False, 'error': f'Account blocked. Reason: {user.blocked_reason}'}), 403

            return generate_user_jwt(user, role)

    # 2. Credential Auth Case (UID/DOB)
    elif 'username' in data or 'u_id' in data:
        uid = data.get('username') or data.get('u_id')
        password = data.get('password')

        if not uid or not password:
            return jsonify({'ok': False, 'error': 'Missing credentials'}), 400

        with SessionLocal() as db:
            user = None
            role = None

            # Check Admin -> Faculty -> Student by UID
            user = db.scalar(select(Admin).where(func.lower(Admin.u_id) == uid.lower()))
            if user:
                role = 'super_admin' if user.admin_type == 'super' else 'admin'
            
            if not user:
                user = db.scalar(select(Faculty).where(func.lower(Faculty.u_id) == uid.lower()))
                if user: role = 'faculty'
                
            if not user:
                user = db.scalar(select(Student).where(func.lower(Student.u_id) == uid.lower()))
                if user: role = 'student'
                
            if not user:
                 return jsonify({'ok': False, 'error': 'User not found'}), 404
                 
            if not check_password(password, user.password):
                return jsonify({'ok': False, 'error': 'Invalid credentials'}), 401
                
            if hasattr(user, 'status') and user.status == 'blocked':
                 return jsonify({'ok': False, 'error': f'Account blocked. Reason: {user.blocked_reason}'}), 403

            return generate_user_jwt(user, role)

    return jsonify({'ok': False, 'error': 'Invalid request components'}), 400

def generate_user_jwt(user, role):
    try:
        expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        payload = {
            'u_id': user.u_id,
            'role': role,
            'exp': expiration
        }
        token = jwt.encode(payload, Config.SECRET_KEY, algorithm='HS256')
        
        return jsonify({
            'ok': True,
            'token': token,
            'role': role,
            'u_id': user.u_id,
            'email': getattr(user, 'email', None),
            'id': user.u_id # For frontend compatibility
        })
    except Exception as e:
        return jsonify({'ok': False, 'error': f'Token generation failed: {str(e)}'}), 500

@bp.post('/logout')
def logout():
    """Invalidate token by adding to blacklist."""
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(" ")[1]
        BLACKLIST.add(token)
        return jsonify({'ok': True, 'message': 'Logged out successfully'})
    return jsonify({'ok': False, 'error': 'No token provided'}), 400
