import sqlite3
import os

DB_PATH = "sdms.sqlite3"
SCHEMA_PATH = "schema.sql"

def apply_schema():
    if not os.path.exists(SCHEMA_PATH):
        print(f"Error: {SCHEMA_PATH} not found.")
        return

    print("Applying strict schema...")
    
    # Read SQL
    with open(SCHEMA_PATH, 'r') as f:
        sql_script = f.read()

    # Connect DB
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    try:
        cursor.executescript(sql_script)
        conn.commit()
        print("Schema applied successfully.")
    except sqlite3.Error as e:
        print(f"SQL Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    apply_schema()
