import sys
import os
import jwt
import datetime

# Imports should work directly if running from backend directory
try:
    print("Test 1: Importing modules...")
    from routes import auth_routes
    from utils.auth_middleware import token_required
    from decorators import admin_required
    print("✅ Imports successful.")

    print("Test 2: Simulating Token Generation and Verification...")
    from config import Config
    
    # Mock Config if needed, but it should be imported
    secret = Config.SECRET_KEY
    print(f"✅ Secret Key loaded: {secret[:5]}...")
    
    # Generate Token
    payload = {
        'u_id': 'TEST_USER',
        'role': 'admin',
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    token = jwt.encode(payload, secret, algorithm='HS256')
    print(f"✅ Token generated: {token[:10]}...")
    
    # Decode Token
    decoded = jwt.decode(token, secret, algorithms=["HS256"])
    print(f"✅ Token decoded: {decoded['u_id']}, Role: {decoded['role']}")
    
    if decoded['u_id'] == 'TEST_USER':
        print("✅ Validation Successful.")
    else:
        print("❌ Validation Failed.")

except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
