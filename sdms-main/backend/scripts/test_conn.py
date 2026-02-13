# backend/scripts/test_conn.py
from database.connection import engine
from sqlalchemy import text

try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("Connected to MySQL! Result:", result.scalar())
except Exception as e:
    print("Connection failed:", e)