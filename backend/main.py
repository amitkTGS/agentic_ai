from fastapi import FastAPI, UploadFile, File
import shutil
from database import Base, engine, SessionLocal
from models import Expense
from ocr import run_ocr
from extraction_agent import extract_fields
from rules_engine import validate_rules
from duplicate_agent import duplicate_probability
from risk_agent import compute_risk
from decision_agent import decide
import json

Base.metadata.create_all(bind=engine)
app = FastAPI()

@app.post("/process")
async def process_expense(employee_id: str, file: UploadFile = File(...)):

    # Save receipt
    file_path = f"receipts/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 1. OCR
    ocr_text = run_ocr(file_path)

    # 2. Extraction Agent
    extracted = json.loads(extract_fields(ocr_text))

    # 3. Rules
    violations = validate_rules(extracted)

    # 4. Duplicate Check
    db = SessionLocal()
    previous = db.query(Expense).all()
    dup_prob = duplicate_probability(extracted, previous)

    # 5. Risk
    risk_level, risk_score = compute_risk(violations, dup_prob)

    # 6. Decision
    decision, explanation = decide(risk_level)

    # Save expense to DB
    exp = Expense(
        employee_id=employee_id,
        vendor=extracted["vendor"],
        amount=extracted["amount"],
        date=extracted["date"],
        category=extracted["category"],
        subcategory=extracted.get("subcategory"),
        payment_mode=extracted.get("payment_mode"),
        receipt_url=file_path
    )
    db.add(exp)
    db.commit()
    db.refresh(exp)

    return {
        "expense_id": exp.id,
        "ocr_text": ocr_text,
        "extracted": extracted,
        "violations": violations,
        "duplicate_probability": dup_prob,
        "risk_level": risk_level,
        "risk_score": risk_score,
        "decision": decision,
        "explanation": explanation
    }

@app.get("/expenses")
def list_expenses():
    db = SessionLocal()
    return db.query(Expense).all()

