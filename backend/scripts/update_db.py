import sqlite3
import datetime

DB_PATH = '../sdms.sqlite3'

def update_schema():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Add column if not exists
        cursor.execute("ALTER TABLE student ADD COLUMN created_at DATE")
        print("Column created_at added to student table.")
    except sqlite3.OperationalError as e:
        print(f"Column might already exist: {e}")
        
    # Backfill with today's date for existing NULLs
    today = datetime.date.today().isoformat()
    cursor.execute("UPDATE student SET created_at = ? WHERE created_at IS NULL", (today,))
    
    conn.commit()
    conn.close()
    print("Schema updated and backfilled.")

if __name__ == "__main__":
    update_schema()
