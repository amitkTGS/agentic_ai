from common import (CATEGORIES, fallback_value,HEALTH_CARE_CATEGORIES)
from fastapi import FastAPI, UploadFile, File,Form,Request
import shutil
from database import Base, engine, SessionLocal
from models import Expense, ExpenseAnalysisResults, Taxonomy
from ocr import run_ocr
# from extraction_agent import (extract_fields,extract_fields_with_rag)
from extraction_agent_new import (extract_fields_with_rag,extract_fields_with_rag_health_care)
from rules_engine import (validate_rules,validate_healthcare_rules)
from duplicate_agent import duplicate_probability
from risk_agent import compute_risk
from decision_agent import decide
import json
from ExpenseFilters import ExpenseFilters
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from schemas import Metrics, MetricsResponse
from fastapi import Query
from rag import (
    delete_expense_embedding,
    retrieve_policy_context,
    store_expense_embedding,
    semantic_duplicate_score,
    retrieve_health_policy_context,
    store_healthcare_claim_embedding,
    semantic_duplicate_score_healthcare
)

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],     # Allow specific origins
    allow_credentials=True,    # Allow cookies and auth headers
    allow_methods=["*"],       # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],
)

@app.post("/expenses")
async def list_expenses(filters: ExpenseFilters = ExpenseFilters()):
    db = SessionLocal()
    query = db.query(Expense)
    
    if filters.status and filters.status != '':
        query = query.filter(Expense.status == filters.status)
        
    if filters.category and filters.category != '':
        query = query.filter(Expense.category == filters.category)

    if filters.start_date and filters.start_date != '':
        query = query.filter(Expense.date >= filters.start_date)

    if filters.end_date and filters.end_date != '':
        query = query.filter(Expense.date <= filters.end_date)
        
    if filters.module and filters.module !='':
        query = query.filter(Expense.module == filters.module)
        
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
    try:
        delete_expense_embedding(expense_id)
    except Exception as e:
        print("Chroma delete error:", e)
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
     ANOMALY_DATA,
    CONFIDENCE_DATA,
    FILE_SCORE_CARD_DATA,
    RISK_BAND_DATA,
    TAXONOMY_DATA,
)


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
        "taxonomy": TAXONOMY_DATA,
        "anamoly":ANOMALY_DATA,
        "risk_band":RISK_BAND_DATA,
        "confidence":CONFIDENCE_DATA,
        "file_score_card":FILE_SCORE_CARD_DATA
    }



@app.post("/process_new")
async def process_expense_new(file: UploadFile = File(...),form_data:str=Form(...)):
    try:
        file_path = f"{file.filename}"
        file_extension = Path(file.filename).suffix.lstrip(".")

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        form = json.loads(form_data)
        emp_id = form.get('employeeId')
        # 1. OCR
        ocr_text = run_ocr(file_path,file_extension)
        # ocr_text = "Biyani Zone\nTotal: 1813\nDate: 06-01-2025\nPaid via UPI"
        policy_context = retrieve_policy_context(ocr_text)

        # 2. Extraction Agent
        extracted = json.loads(extract_fields_with_rag(ocr_text,policy_context))
        # extracted = json.loads('{"category":"Food","total_amount":813,"vendor":"biyani zone","date":"2025-01-06"}')
        # 3. Rules
        extracted_category = extracted.get("category")
        if extracted_category:
            category_key = str(extracted_category).strip().lower()
            extracted_category = CATEGORIES.get(category_key)
        else:
            extracted_category = None
        extracted_date = extracted.get("date")
        extracted["category"] = fallback_value(extracted_category, form.get("category"))
        extracted["date"] = fallback_value(extracted_date, form.get("expenseDate"))

        violations = validate_rules(extracted)
        # 4. Duplicate Check
        db = SessionLocal()
        previous = db.query(Expense).all()
        fuzzy_dup = duplicate_probability(extracted, previous)
        semantic_dup = semantic_duplicate_score(ocr_text)
        
        dup_prob = max(fuzzy_dup, semantic_dup)
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
            receipt_url=file_path,
            module = "finance"
        )

        db.add(expense)
        db.commit()          
        db.refresh(expense)  
        
        store_expense_embedding(
            expense.id,
            ocr_text,
            {
                "vendor": expense.vendor,
                "amount": expense.total_amount,
                "category": expense.category
            }
        )
        
        exp_analysis = ExpenseAnalysisResults(
            expense_id=expense.id,
            ocr_text=ocr_text,
            extracted=json.dumps(extracted) if extracted else None,
            violations=json.dumps(violations) if violations else None,
            duplicate_probability=dup_prob,
            risk_level=risk_level,
            risk_score=risk_score,
            decision=decision,
            explanation=explanation,
        )
        
        db.add(exp_analysis)
        db.commit()
        db.refresh(exp_analysis)

        return {
            "expense_id": expense.id,
        }
    except Exception as e:
        print(e)

@app.post('/api/save_taxonomy')
async def save_taxonomy(data:Request):
    data = await data.json()
    db = SessionLocal()
    save_taxonomy = Taxonomy(
        module=data.get('module',''),
        category=data.get('category',''),
        sub_category=data.get('sub_category','')
    )
    
    db.add(save_taxonomy)
    db.commit()
    db.refresh(save_taxonomy)
    return {"message": "Taxonomy Saved Successfully"}


@app.post("/process_healthcare")
async def process_expense_new_health(file: UploadFile = File(...),form_data:str=Form(...)):
    try:
        file_path = f"{file.filename}"
        file_extension = Path(file.filename).suffix.lstrip(".")

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        form = json.loads(form_data)
        emp_id = form.get('employeeId')
        # 1. OCR
        ocr_text = run_ocr(file_path,file_extension)

        # ocr_text = "Biyani Zone\nTotal: 1813\nDate: 06-01-2025\nPaid via UPI"
        policy_context = retrieve_health_policy_context(ocr_text)

        # 2. Extraction Agent
        extracted = json.loads(extract_fields_with_rag_health_care(ocr_text,policy_context))
        # extracted = json.loads(' {"vendor": "Maitri Clinic", "doctor_name": "Dr. Priya Patil", "department": null, "visit_type": "OPD", "consultation_charges": 500.00, "tests_charges": null, "total_amount": 690.00, "date": "10-06-2025", "patient_name": "RANJITHA B M", "category": "treatment_category"}')
        # 3. Rules
        extracted_category = extracted.get("category")
        if extracted_category:
            category_key = str(extracted_category).strip().lower()
            extracted_category = HEALTH_CARE_CATEGORIES.get(category_key)
        else:
            extracted_category = None
        # convert the extracted_cate
        extracted_date = extracted.get("date")
        extracted["category"] = fallback_value(extracted_category, form.get("category"))
        extracted["date"] = fallback_value(extracted_date, form.get("expenseDate"))

        violations = validate_healthcare_rules(extracted)
        # 4. Duplicate Check
        db = SessionLocal()
        previous = db.query(Expense).all()
        fuzzy_dup = duplicate_probability(extracted, previous)
        semantic_dup = semantic_duplicate_score_healthcare(ocr_text)
        
        dup_prob = max(fuzzy_dup, semantic_dup)
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
            receipt_url=file_path,
            module ="health"
        )

        db.add(expense)
        db.commit()          
        db.refresh(expense)  
        
        store_healthcare_claim_embedding(
            expense.id,
            ocr_text,
            {
                "vendor": expense.vendor,
                "amount": expense.total_amount,
                "category": expense.category
            }
        )
        
        exp_analysis = ExpenseAnalysisResults(
            expense_id=expense.id,
            ocr_text=ocr_text,
            extracted=json.dumps(extracted) if extracted else None,
            violations=json.dumps(violations) if violations else None,
            duplicate_probability=dup_prob,
            risk_level=risk_level,
            risk_score=risk_score,
            decision=decision,
            explanation=explanation,
        )
        
        db.add(exp_analysis)
        db.commit()
        db.refresh(exp_analysis)

        return {
            "expense_id": expense.id,
        }
    except Exception as e:
        print(e)

