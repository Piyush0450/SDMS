# backend/scripts/seed_db.py
"""
Run this from backend folder:
    python -m scripts.seed_db
"""

from pathlib import Path
from database.connection import engine

def main():
    seed_file = Path(__file__).resolve().parent.parent / "database" / "seed.sql"
    if not seed_file.exists():
        raise SystemExit("seed.sql not found in database/ folder")

    sql = seed_file.read_text(encoding="utf8").strip()
    if not sql:
        raise SystemExit("❌ seed.sql is empty")

    with engine.begin() as conn:
        for stmt in [s for s in sql.split(";") if s.strip()]:
            conn.exec_driver_sql(stmt)

    print("Seed data inserted.")

if __name__ == "__main__":
    main()