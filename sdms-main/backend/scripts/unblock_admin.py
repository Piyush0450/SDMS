import sqlite3
import datetime

DB_PATH = '../database/sdms.sqlite3'

def unblock_user(email):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print(f"Checking for user: {email}")
    cursor.execute("SELECT u_id, name, status, admin_type FROM admin WHERE lower(email) = ?", (email.lower(),))
    user = cursor.fetchone()
    
    if user:
        print(f"User found: {user}")
        try:
            # Update user to be active and super admin
            cursor.execute("""
                UPDATE admin 
                SET status = 'active', 
                    admin_type = 'super',
                    blocked_by = NULL,
                    blocked_reason = NULL,
                    blocked_at = NULL,
                    unblock_at = NULL
                WHERE lower(email) = ?
            """, (email.lower(),))
            
            if cursor.rowcount > 0:
                print("User successfully updated to 'active' and 'super' admin.")
            else:
                print("No rows updated.")
                
            conn.commit()
        except Exception as e:
            print(f"Error updating user: {e}")
    else:
        print("User not found in 'admin' table.")
        # Optional: Ask if we should create? For now just report.
        
    conn.close()

if __name__ == "__main__":
    email = "piyushchaurasiya348@gmail.com"
    unblock_user(email)
