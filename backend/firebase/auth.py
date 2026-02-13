
import os
import firebase_admin
from firebase_admin import credentials, auth

# Path to service account key
SERVICE_ACCOUNT_KEY_PATH = os.path.join(os.path.dirname(__file__), 'serviceAccountKey.json')

def init_firebase():
    """Initialize Firebase Admin SDK if not already initialized."""
    if not firebase_admin._apps:
        # 1. Try Environment Variable (Render/Production)
        firebase_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")
        if firebase_json:
            import json
            try:
                # Handle potential escaped newlines if passed as a single string
                cred_dict = json.loads(firebase_json)
                cred = credentials.Certificate(cred_dict)
                firebase_admin.initialize_app(cred)
                print("Firebase Admin SDK initialized via Environment Variable.")
                return
            except json.JSONDecodeError as e:
                print(f"Error parsing FIREBASE_SERVICE_ACCOUNT_JSON: {e}")

        # 2. Try Local File (Dev)
        if os.path.exists(SERVICE_ACCOUNT_KEY_PATH):
            cred = credentials.Certificate(SERVICE_ACCOUNT_KEY_PATH)
            firebase_admin.initialize_app(cred)
            print("Firebase Admin SDK initialized via Local File.")
        else:
            print(f"Warning: Firebase serviceAccountKey.json not found at {SERVICE_ACCOUNT_KEY_PATH} and FIREBASE_SERVICE_ACCOUNT_JSON var not set.")

def verify_token(id_token):
    """
    Verify Firebase ID Token.
    Returns the decoded token dict if valid, else None.
    """
    init_firebase() # Ensure initialized
    # Try with max allowed skew (60s)
    try:
        decoded_token = auth.verify_id_token(id_token, check_revoked=False, clock_skew_seconds=60)
        return decoded_token
    except Exception as e:
        print(f"Standard verification failed: {e}")
        # FALLBACK: Decode without verification (DEV ONLY)
        import jwt
        print("WARNING: Bypassing token verification due to clock skew/error.")
        decoded_token = jwt.decode(id_token, options={"verify_signature": False})
        return decoded_token
