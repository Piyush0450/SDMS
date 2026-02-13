import sqlite3

def inspect_db():
    try:
        conn = sqlite3.connect('d:/sdms/sdms-main/backend/database/sdms.sqlite3')
        cursor = conn.cursor()
        
        print("--- Tables ---")
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        for table in tables:
            print(f"Table: {table[0]}")
            cursor.execute(f"PRAGMA table_info({table[0]})")
            columns = cursor.fetchall()
            for col in columns:
                print(f"  - {col[1]} ({col[2]})")
            print("")
            
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_db()
