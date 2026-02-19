from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE expenses ADD COLUMN module VARCHAR"))
    conn.execute(text("UPDATE expenses SET module = 'expense'"))
    conn.commit()