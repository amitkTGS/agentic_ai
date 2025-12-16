from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from database import Base
from datetime import datetime

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String)
    vendor = Column(String)
    amount = Column(Float)
    date = Column(String)
    category = Column(String)
    subcategory = Column(String)
    payment_mode = Column(String)
    receipt_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Violation(Base):
    __tablename__ = "violations"
    id = Column(Integer, primary_key=True)
    expense_id = Column(Integer, ForeignKey("expenses.id"))
    rule_id = Column(String)
    severity = Column(String)
    description = Column(String)

class Duplicate(Base):
    __tablename__ = "duplicates"
    id = Column(Integer, primary_key=True)
    expense_id = Column(Integer, ForeignKey("expenses.id"))
    probability = Column(Float)

class RiskScore(Base):
    __tablename__ = "risk_scores"
    id = Column(Integer, primary_key=True)
    expense_id = Column(Integer, ForeignKey("expenses.id"))
    risk_level = Column(String)
    score = Column(Float)
