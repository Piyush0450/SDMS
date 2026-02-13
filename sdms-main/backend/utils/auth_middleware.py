from functools import wraps
from flask import request, jsonify, g
import jwt
import datetime
from config import Config
from blacklist import BLACKLIST

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header and auth_header.startswith('Bearer '):
            parts = auth_header.split()
            if len(parts) >= 2:
                token = parts[1]
        
        if not token:
            return jsonify({'ok': False, 'error': 'Token is missing!'}), 401
            
        # Check blacklist
        if token in BLACKLIST:
             return jsonify({'ok': False, 'error': 'Token has been revoked (logged out)!'}), 401
        
        try:
            # Decode JWT
            payload = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
            
            # Store payload info in g
            g.user_id = payload.get('u_id')
            g.user_role = payload.get('role')
            g.token_exp = payload.get('exp')
            
            if not g.user_id or not g.user_role:
                 return jsonify({'ok': False, 'error': 'Invalid token payload'}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({'ok': False, 'error': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'ok': False, 'error': 'Invalid token!'}), 401
        except Exception as e:
            return jsonify({'ok': False, 'error': f'Token verification failed: {str(e)}'}), 401
            
        return f(*args, **kwargs)
    return decorated
