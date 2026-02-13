import sqlite3
import os

DB_PATH = "sdms.sqlite3"
APPROVED_TABLES = {"admin", "faculty", "student", "subject", "marks", "attendance", "sqlite_sequence"}

def generate_create_sql(table_name, cursor):
    cursor.execute(f"SELECT sql FROM sqlite_master WHERE type='table' AND name='{table_name}';")
    row = cursor.fetchone()
    if row:
        return row[0] + ";"
    return f"-- Table {table_name} not found!"

def audit_schema():
    if not os.path.exists(DB_PATH):
        print("Database file NOT found!")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. Identify Tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = {row[0] for row in cursor.fetchall()}

    unnecessary_tables = tables - APPROVED_TABLES
    
    print("=================================================")
    print("        DATABASE SCHEMA AUDIT REPORT             ")
    print("=================================================")
    
    # 2. DROP Statements
    print("\n-- 1. DROP STATEMENTS FOR UNNECESSARY TABLES --")
    if unnecessary_tables:
        for table in unnecessary_tables:
            print(f"DROP TABLE IF EXISTS {table};")
            # Actually drop them
            cursor.execute(f"DROP TABLE IF EXISTS {table}")
        conn.commit()
        print("-- Unnecessary tables dropped successfully. --")
    else:
        print("-- No unnecessary tables found. Database is clean. --")

    # 3. CREATE Statements (Final Schema)
    print("\n-- 2. FINAL SCHEMA SNAPSHOT (CREATE STATEMENTS) --")
    final_tables = tables - unnecessary_tables
    # Order them for readability if possible, or just list
    ordered_tables = ["admin", "faculty", "student", "subject", "marks", "attendance"]
    for table in ordered_tables:
        if table in final_tables:
            print(generate_create_sql(table, cursor))
            print()

    # 4. Confirmation
    print("\n-- 3. CONFIRMATION: SHOW TABLES --")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    final_rows = cursor.fetchall()
    print("+---------------------+")
    print("| Tables_in_sdms      |")
    print("+---------------------+")
    for row in final_rows:
        print(f"| {row[0]:<19} |")
    print("+---------------------+")

    conn.close()

if __name__ == "__main__":
    audit_schema()
