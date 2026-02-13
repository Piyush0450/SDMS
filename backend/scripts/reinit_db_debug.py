
import sys
import os

# Redirect stderr to stdout
sys.stderr = sys.stdout

print("Starting debug script")
try:
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    print("Path updated")
    
    from database.connection import Base, engine
    print("DB connection imported")
    
    print("Importing User...")
    from models.user import Teacher
    print("User imported")
    print(f"Tables: {list(Base.metadata.tables.keys())}")
    
    print("Importing Department...")
    from models.department import Department
    print("Department imported")
    
    print("Importing Academic...")
    from models.academic import Class
    print("Academic imported")
    
    print("Configuration Mapper Trigger...")
    from sqlalchemy.orm import configure_mappers
    configure_mappers()
    print("Mappers configured")
    
except Exception as e:
    print("CAUGHT EXCEPTION:")
    import traceback
    traceback.print_exc()
