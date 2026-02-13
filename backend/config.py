# config.py
from urllib.parse import quote_plus
import os
from dotenv import load_dotenv

load_dotenv()

# DB_USER = "root"               # match Workbench
# DB_PASS = quote_plus("nam1234")  # enter same password Workbench uses
# DB_HOST = "127.0.0.1"          # or localhost
# DB_PORT = "3306"               # match Workbench (sometimes 3307 on Windows)
# DB_NAME = "sdms_connection"    # your database name

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "database", "sdms.sqlite3")

class Config:
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{DB_PATH}"
    SQLALCHEMY_ECHO = False
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret")

# from database.connection import engine

# try:
#     with engine.connect() as conn:
#         result = conn.execute("SELECT 1")
#         print("✅ Connected! Result:", result.scalar())
# except Exception as e:
#     print("❌ Failed:", e)