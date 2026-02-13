from functools import wraps
from flask import request, jsonify, g
from firebase.auth import verify_token
from database.connection import SessionLocal

from sqlalchemy import select

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({'ok': False, 'error': 'Token is missing!'}), 401
        
        try:
            # Special bypass for dev environment or specific dev token if you implemented one
            # For now, relying on firebase verify_token
            decoded_token = verify_token(token)
            if not decoded_token:
                 return jsonify({'ok': False, 'error': 'Invalid token!'}), 401
            
            email = decoded_token.get('email')
            if not email:
                 return jsonify({'ok': False, 'error': 'Token missing email!'}), 401

            # Fetch user from DB to get role and ID
            with SessionLocal() as db:
                from sqlalchemy import func
                from models.models import Admin, Faculty, Student
                
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
                    return jsonify({'ok': False, 'error': 'User not found in system!'}), 403
                
                # Check Blocked Status
                if hasattr(user, 'status') and user.status == 'blocked':
                    return jsonify({'ok': False, 'error': 'Account Blocked! Contact Admin.'}), 403

                # Store user info
                g.user_email = user.email
                if role == 'admin' and user.admin_type == 'super':
                    g.user_role = 'super_admin'
                else:
                    g.user_role = role
                g.user_id = user.u_id
                
        except Exception as e:
            return jsonify({'ok': False, 'error': f'Token verification failed: {str(e)}'}), 401
            
        return f(*args, **kwargs)
    return decorated

def role_required(allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not getattr(g, 'user_role', None):
                 return jsonify({'ok': False, 'error': 'User role not determined!'}), 401
            
            if g.user_role not in allowed_roles:
                return jsonify({'ok': False, 'error': 'Access denied: Insufficient privileges'}), 403
                
            return f(*args, **kwargs)
        return decorated_function
    return decorator
