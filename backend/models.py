from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON
from database import Base
from datetime import datetime

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String)
    vendor = Column(String)
    total_amount = Column(Float)
    date = Column(String, nullable=True)
    status = Column(String, nullable=True)
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

class ExpenseAnalysisResults(Base):
    __tablename__ = "expense_analysis_results"

    id = Column(Integer, primary_key=True, index=True)

    expense_id = Column(Integer,ForeignKey("expenses.id"))

    ocr_text = Column(Text, nullable=True)

    extracted = Column(Text, nullable=True)      
    violations = Column(Text, nullable=True)     

    duplicate_probability = Column(Float, nullable=True)

    risk_level = Column(Text, nullable=True)   
    risk_score = Column(Float, nullable=True)

    decision = Column(Text, nullable=True)    
    explanation = Column(Text, nullable=True)


