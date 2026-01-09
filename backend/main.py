from common import CATEGORIES, fallback_value
from fastapi import FastAPI, UploadFile, File,Form
import shutil
from database import Base, engine, SessionLocal
from models import Expense, ExpenseAnalysisResults
from ocr import run_ocr
from extraction_agent import extract_fields
from rules_engine import validate_rules
from duplicate_agent import duplicate_probability
from risk_agent import compute_risk
from decision_agent import decide
import json
from ExpenseFilters import ExpenseFilters
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from schemas import Metrics, MetricsResponse
from fastapi import Query


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],     # Allow specific origins
    allow_credentials=True,    # Allow cookies and auth headers
    allow_methods=["*"],       # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],
)

@app.post("/process")
async def process_expense(file: UploadFile = File(...),form_data:str=Form(...)):
    try:
        file_path = f"{file.filename}"
        file_extension = Path(file.filename).suffix.lstrip(".")

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        # import ipdb;ipdb.set_trace();
        form = json.loads(form_data)
        emp_id = form.get('employeeId')
        # 1. OCR
        ocr_text = run_ocr(file_path,file_extension)

        # 2. Extraction Agent
        # extracted = json.loads(extract_fields(file_path))
        extracted = json.loads(extract_fields(ocr_text))
        # extracted = json.loads('{"category":"Food","total_amount":813,"vendor":"biyani zone","date":"2025-01-06"}')
        # print(extracted)
        # 3. Rules
        extracted_category = extracted.get("category")
        if extracted_category:
            category_key = str(extracted_category).strip().lower()
            extracted_category = CATEGORIES.get(category_key)
        else:
            extracted_category = None
        # convert the extracted_cate
        extracted_date = extracted.get("date")
        extracted["category"] = fallback_value(extracted_category, form.get("category"))
        extracted["date"] = fallback_value(extracted_date, form.get("expenseDate"))

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
        expense = Expense(
            employee_id=emp_id,
            vendor=extracted.get("vendor", ''),
            total_amount=extracted.get("total_amount", ''),
            date=extracted.get("date", ''),
            status=decision,
            category=extracted.get("category", ''),
            subcategory=extracted.get("subcategory", ''),
            payment_mode=extracted.get("payment_mode", ''),
            receipt_url=file_path
        )

        db.add(expense)
        db.commit()          
        db.refresh(expense)  
        
        exp_analysis = ExpenseAnalysisResults(
            expense_id=expense.id,
            ocr_text=ocr_text,
            extracted=json.dumps(extracted) if extracted else None,
            violations=json.dumps(violations) if violations else None,
            duplicate_probability=dup_prob,
            risk_level=risk_level,
            risk_score=risk_score,
            decision=decision,
            explanation=explanation
        )
        
        db.add(exp_analysis)
        db.commit()
        db.refresh(exp_analysis)

        return {
            "expense_id": expense.id,
        }
    except Exception as e:
        print(e)


@app.post("/expenses")
async def list_expenses(filters: ExpenseFilters = ExpenseFilters()):
    db = SessionLocal()
    query = db.query(Expense)
    if filters.category and filters.category != '':
        query = query.filter(Expense.category == filters.category)

    if filters.start_date and filters.start_date != '':
        query = query.filter(Expense.date >= filters.start_date)

    if filters.end_date and filters.end_date != '':
        query = query.filter(Expense.date <= filters.end_date)

    return query.all()

@app.get('/expense/{id}')
def get_expense(id:int):
    db = SessionLocal()
    expense_analysis = db.query(ExpenseAnalysisResults).filter(ExpenseAnalysisResults.expense_id == id).first()
    return expense_analysis
    
@app.get("/expense/{id}/{status}")
def approve_expense(id: int,status:str):
    db = SessionLocal()
    expense = db.query(Expense).filter(Expense.id == id).first()
    expense.status = status
    db.commit()
    expense_analytics = db.query(ExpenseAnalysisResults).filter(ExpenseAnalysisResults.expense_id == id).first()
    expense_analytics.decision = status
    db.commit()
    return {"message": "Expense approved"}
    

@app.delete('/expense/{expense_id}')
async def delete_record(expense_id:int):
    db = SessionLocal()
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    db.delete(expense)
    db.commit()
    expense_analaysis = db.query(ExpenseAnalysisResults).filter(ExpenseAnalysisResults.expense_id == expense_id).first()
    db.delete(expense_analaysis)
    db.commit()
    return {"message": "Expense deleted successfully"}

@app.delete('/expense_analysis/{id}')
async def delete_record(id:int):
    db = SessionLocal()
    expense_analaysis = db.query(ExpenseAnalysisResults).filter(ExpenseAnalysisResults.id == id).first()
    db.delete(expense_analaysis)
    db.commit()
    return {"message": "Expense deleted successfully"}



from calculations import (
    calculate_cas,
    ocr_accuracy,
    extraction_accuracy,
    policy_accuracy,
    duplicate_score,
    decision_accuracy,
)
from datastore import (
    OCR_DATA,
    EXTRACTION_DATA,
    POLICY_DATA,
    DUPLICATE_DATA,
    HITL_DATA,
)


# @app.get("/api/metrics/summary", response_model=MetricsResponse)
# def metrics_summary(mode: str = Query("demo", enum=["demo", "live"])):
#     # Later: switch to DB if mode == live
#     metrics = Metrics(
#         ocr=ocr_accuracy(OCR_DATA),
#         extraction=extraction_accuracy(EXTRACTION_DATA),
#         policy=policy_accuracy(POLICY_DATA),
#         duplicate=duplicate_score(DUPLICATE_DATA),
#         decision=decision_accuracy(HITL_DATA),
#     )

#     return MetricsResponse(
#         metrics=metrics,
#         cas=calculate_cas(metrics.dict())
#     )


@app.get("/api/metrics/details")
def metrics_details():

    metrics = Metrics(
        ocr=ocr_accuracy(OCR_DATA),
        extraction=extraction_accuracy(EXTRACTION_DATA),
        policy=policy_accuracy(POLICY_DATA),
        duplicate=duplicate_score(DUPLICATE_DATA),
        decision=decision_accuracy(HITL_DATA),
    )
    return {
        "metrics": metrics,
        "ocr": OCR_DATA,
        "extraction": EXTRACTION_DATA,
        "policy": POLICY_DATA,
        "duplicate": DUPLICATE_DATA,
        "hitl": HITL_DATA,
    }



