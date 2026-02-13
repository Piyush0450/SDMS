import sqlite3
import os

DB_PATH = 'database/sdms.sqlite3'

def check_schema():
    """
    Checks if the critical columns exist in the database tables.
    """
    print("Running startup schema check...")
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}. Skipping schema check (will be created).")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    tables_to_check = ['admin', 'faculty', 'student']
    required_columns = ['status', 'blocked_by', 'blocked_reason', 'blocked_at', 'unblock_at']
    
    missing_found = False
    
    for table in tables_to_check:
        try:
            cursor.execute(f"PRAGMA table_info({table})")
            columns_info = cursor.fetchall()
            existing_columns = [col[1] for col in columns_info]
            
            for req_col in required_columns:
                if req_col not in existing_columns:
                    print(f"CRITICAL WARNING: Column '{req_col}' missing in table '{table}'")
                    missing_found = True
        except Exception as e:
            print(f"Error checking table {table}: {e}")
            
    conn.close()
    
    if missing_found:
        print("Schema check FAILED. Please run the migration script: python scripts/update_db_v2.py")
        # In strict mode, we might want to raise an exception to stop startup.
        # raise Exception("Database schema is missing required columns.")
    else:
        print("Schema check PASSED. All blocked status columns are present.")

if __name__ == "__main__":
    check_schema()
