import os
import zipfile
from pathlib import Path

# -------------------------------------------------------
# Helper to write files
# -------------------------------------------------------
def write(path, content):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

# -------------------------------------------------------
# FRONTEND FILES
# -------------------------------------------------------
frontend_package_json = """{
  "name": "expense-audit-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}
"""

frontend_app_js = """import React from 'react';
import Upload from './Upload';
import Dashboard from './Dashboard';

function App() {
  return (
    <div style={{padding: 20}}>
      <h1>Expense Audit POC</h1>
      <Upload />
      <hr />
      <Dashboard />
    </div>
  );
}
export default App;
"""

frontend_upload_js = """import React, { useState } from 'react';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const process = async () => {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("http://localhost:8000/process?employee_id=EMP123", {
      method: "POST",
      body: form
    });

    const json = await res.json();
    setResult(json);
  };

  return (
    <div>
      <h2>Upload Receipt</h2>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={process}>Process</button>

      {result && (
        <pre style={{marginTop:20, background:'#eee', padding:10}}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
"""

frontend_dashboard_js = """import React, { useEffect, useState } from 'react';

export default function Dashboard() {

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/expenses")
      .then(res => res.json())
      .then(setItems);
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Vendor</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Risk</th>
            <th>Decision</th>
          </tr>
        </thead>
        <tbody>
          {items.map(x => (
            <tr key={x.id}>
              <td>{x.id}</td>
              <td>{x.vendor}</td>
              <td>{x.amount}</td>
              <td>{x.date}</td>
              <td>{x.risk}</td>
              <td>{x.decision}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
"""

# -------------------------------------------------------
# BACKEND FILES
# -------------------------------------------------------
backend_main = """from fastapi import FastAPI, UploadFile, File
import json, shutil
from ocr import run_ocr
from extraction_agent import extract_fields
from rules_engine import validate_rules
from duplicate_agent import duplicate_probability
from risk_agent import compute_risk
from decision_agent import decide
from models import Expense
from database import SessionLocal, Base, engine
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process")
async def process_expense(employee_id: str, file: UploadFile = File(...)):

    path = f"receipts/{file.filename}"
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    ocr_text = run_ocr(path)
    extracted = json.loads(extract_fields(ocr_text))

    violations = validate_rules(extracted)

    db = SessionLocal()
    previous = db.query(Expense).all()
    dup = duplicate_probability(extracted, previous)

    risk, score = compute_risk(violations, dup)
    decision, explanation = decide(risk)

    exp = Expense(
        employee_id=employee_id,
        vendor=extracted.get("vendor"),
        amount=extracted.get("amount"),
        date=extracted.get("date"),
        category=extracted.get("category"),
        subcategory=extracted.get("subcategory"),
        payment_mode=extracted.get("payment_mode"),
        receipt_url=path,
        risk=risk,
        decision=decision
    )

    db.add(exp)
    db.commit()

    return {
        "extracted": extracted,
        "violations": violations,
        "duplicate_probability": dup,
        "risk": risk,
        "decision": decision,
        "explanation": explanation
    }

@app.get("/expenses")
def list_all():
    db = SessionLocal()
    return db.query(Expense).all()
"""

backend_database = """from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

engine = create_engine("sqlite:///./expenses.db", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False)
Base = declarative_base()
"""

backend_models = """from sqlalchemy import Column, Integer, String, Float
from database import Base

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True)
    employee_id = Column(String)
    vendor = Column(String)
    amount = Column(Float)
    date = Column(String)
    category = Column(String)
    subcategory = Column(String)
    payment_mode = Column(String)
    receipt_url = Column(String)
    risk = Column(String)
    decision = Column(String)
"""

backend_ocr = """from paddleocr import PaddleOCR

ocr = PaddleOCR(lang='en')

def run_ocr(path):
    result = ocr.ocr(path)
    return "\\n".join([line[1][0] for line in result[0]])
"""

backend_extraction = """from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

system_prompt = \"\"\"
You are an extraction agent.
Extract vendor, date, amount, category, currency.
Return JSON.
If unsure return null.
\"\"\"

def extract_fields(text):
    r = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": text}
        ]
    )
    return r.choices[0].message.content
"""

backend_rules = """def validate_rules(exp):

    out = []

    if exp.get("category") == "Food" and exp.get("amount", 0) > 1500:
        out.append({"rule": "MEAL_CAP", "severity": "Medium", "desc": "Meal exceeds 1500 INR"})

    if exp.get("category") == "Travel" and exp.get("amount", 0) > 5000:
        out.append({"rule": "TRAVEL_CAP", "severity": "Medium", "desc": "Travel above 5000"})

    if not exp.get("vendor"):
        out.append({"rule": "MISSING_VENDOR", "severity": "High", "desc": "Vendor missing"})

    return out
"""

backend_duplicate = """from rapidfuzz import fuzz

def duplicate_probability(exp, previous):
    scores = []
    for p in previous:
        s1 = fuzz.ratio(exp.get("vendor",""), p.vendor)
        s2 = fuzz.ratio(str(exp.get("amount","")), str(p.amount))
        s3 = fuzz.ratio(str(exp.get("date","")), p.date)
        scores.append((s1+s2+s3)/300)
    return max(scores) if scores else 0
"""

backend_risk = """def compute_risk(violations, dup):
    if dup > 0.7:
        return "High", dup
    if any(v["severity"]=="High" for v in violations):
        return "High", 0.8
    if dup > 0.4 or len(violations)>0:
        return "Medium", 0.5
    return "Low", 0.1
"""

backend_decision = """def decide(risk):
    if risk == "Low":
        return "APPROVED", "Automatically approved"
    return "FLAGGED", "Requires manual review"
"""

requirements_txt = """fastapi
uvicorn[standard]
sqlalchemy
paddleocr
paddlepaddle
python-multipart
openai
rapidfuzz
"""

dockerfile_backend = """FROM python:3.10
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
"""

dockerfile_frontend = """FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "start"]
"""

docker_compose = """version: "3"

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app

  chromadb:
    image: chromadb/chromadb:latest
    ports:
      - "8001:8001"

  ollama:
    image: ollama/ollama
    ports:
      - "11434:11434"
"""

# -------------------------------------------------------
# CREATE FILES
# -------------------------------------------------------
write("backend/main.py", backend_main)
write("backend/database.py", backend_database)
write("backend/models.py", backend_models)
write("backend/ocr.py", backend_ocr)
write("backend/extraction_agent.py", backend_extraction)
write("backend/rules_engine.py", backend_rules)
write("backend/duplicate_agent.py", backend_duplicate)
write("backend/risk_agent.py", backend_risk)
write("backend/decision_agent.py", backend_decision)
write("backend/requirements.txt", requirements_txt)
write("backend/Dockerfile", dockerfile_backend)
write("backend/receipts/.gitkeep", "")

write("frontend/package.json", frontend_package_json)
write("frontend/src/App.js", frontend_app_js)
write("frontend/src/Upload.js", frontend_upload_js)
write("frontend/src/Dashboard.js", frontend_dashboard_js)
write("frontend/public/index.html", "<div id='root'></div>")
write("frontend/Dockerfile", dockerfile_frontend)

write("docker-compose.yml", docker_compose)

# -------------------------------------------------------
# ZIP EVERYTHING
# -------------------------------------------------------
zip_filename = "expense_audit_poc_full.zip"
with zipfile.ZipFile(zip_filename, "w", zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk("."):
        for f in files:
            if f != zip_filename and not f.endswith(".pyc"):
                z.write(os.path.join(root, f))

print(f"\nZIP created: {zip_filename}\n")
