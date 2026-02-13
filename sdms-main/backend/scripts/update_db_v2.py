import sqlite3
import datetime

DB_PATH = '../database/sdms.sqlite3'

def update_schema_v2():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    tables = ['admin', 'faculty', 'student']
    columns = [
        ("status", "VARCHAR(20) DEFAULT 'active'"),
        ("blocked_by", "VARCHAR(50)"),
        ("blocked_reason", "VARCHAR(255)"),
        ("blocked_at", "DATE"),
        ("unblock_at", "DATE")
    ]
    
    for table in tables:
        print(f"Updating table: {table}")
        for col_name, col_type in columns:
            try:
                cursor.execute(f"ALTER TABLE {table} ADD COLUMN {col_name} {col_type}")
                print(f"  Added column {col_name}")
            except sqlite3.OperationalError as e:
                print(f"  Column {col_name} might already exist: {e}")
                
    # Create Audit Logs table if not exists
    print("Creating audit_log table...")
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        actor_id VARCHAR(50) NOT NULL,
        target_id VARCHAR(50) NOT NULL,
        action VARCHAR(50) NOT NULL,
        reason VARCHAR(255),
        timestamp DATE NOT NULL
    )
    """)
    
    conn.commit()
    conn.close()
    print("Schema v2 updated.")

if __name__ == "__main__":
    update_schema_v2()
