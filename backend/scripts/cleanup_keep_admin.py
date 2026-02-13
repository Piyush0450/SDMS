
import os
import sys
from sqlalchemy import create_engine, MetaData, text

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from database.connection import engine
    print("Successfully connected to the database.")
except ImportError as e:
    print(f"Failed to import database connection: {e}")
    sys.exit(1)

def cleanup_tables_keep_admin():
    print("Starting database cleanup (keeping 'admin' table)...")
    
    # Reflect current database state
    metadata = MetaData()
    metadata.reflect(bind=engine)
    
    # Get all table names
    all_tables = list(metadata.tables.keys())
    print(f"Found tables: {all_tables}")
    
    # Filter tables to drop (everything except 'admin')
    tables_to_drop = [t for t in all_tables if t != 'admin']
    
    if not tables_to_drop:
        print("No tables to drop. 'admin' is the only table (or DB is empty).")
        return

    print(f"Dropping tables: {tables_to_drop}")
    
    # Disable foreign key checks to avoid ordering issues during drop
    # This syntax is for MySQL. For SQLite it would be PRAGMA foreign_keys=OFF
    # Since we are migrating/using MySQL (based on previous context of 'projects/sdms' usually implying larger stack, but connection.py had echoes of sqlite if not changed), 
    # lets try to be safe. If it's SQLite, 'SET FOREIGN_KEY_CHECKS' might fail or be ignored.
    # Actually, let's check the dialect.
    
    c = engine.connect()
    try:
        if engine.dialect.name == 'mysql':
            c.execute(text("SET FOREIGN_KEY_CHECKS = 0"))
        elif engine.dialect.name == 'sqlite':
             c.execute(text("PRAGMA foreign_keys=OFF"))
             
        # Drop tables one by one or in batch.
        # Metadata.drop_all expects a list of tables.
        # We need to pass the Table objects, not just names.
        subset = [metadata.tables[t] for t in tables_to_drop]
        metadata.drop_all(bind=engine, tables=subset)
        
        if engine.dialect.name == 'mysql':
            c.execute(text("SET FOREIGN_KEY_CHECKS = 1"))
        elif engine.dialect.name == 'sqlite':
             c.execute(text("PRAGMA foreign_keys=ON"))
             
        print("Successfully dropped targeted tables.")
        
    except Exception as e:
        print(f"An error occurred during cleanup: {e}")
    finally:
        c.close()

if __name__ == "__main__":
    cleanup_tables_keep_admin()
