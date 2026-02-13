from functools import wraps
from flask import g, jsonify
from utils.auth_middleware import token_required

def role_required(allowed_roles):
    """
    Internal decorator to check if g.user_role is in allowed_roles.
    Must be used AFTER @token_required so g.user_role is populated.
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not hasattr(g, 'user_role'):
                return jsonify({'ok': False, 'error': 'User role not determined! Missing @token_required?'}), 401
            
            if g.user_role not in allowed_roles:
                return jsonify({'ok': False, 'error': 'Access denied: Insufficient privileges'}), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def admin_required(f):
    @wraps(f)
    @token_required
    @role_required(['admin', 'super_admin'])
    def decorated(*args, **kwargs):
        return f(*args, **kwargs)
    return decorated

def faculty_required(f):
    @wraps(f)
    @token_required
    @role_required(['faculty'])
    def decorated(*args, **kwargs):
        return f(*args, **kwargs)
    return decorated

def student_required(f):
    @wraps(f)
    @token_required
    @role_required(['student'])
    def decorated(*args, **kwargs):
        return f(*args, **kwargs)
    return decorated
