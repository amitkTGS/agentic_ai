OCR_DATA = [
    {"field": "Vendor", "correct": 92, "incorrect": 8},
    {"field": "Date", "correct": 90, "incorrect": 10},
    {"field": "Amount", "correct": 95, "incorrect": 5},
    {"field": "Currency", "correct": 98, "incorrect": 2},
]

EXTRACTION_DATA = [
    {"field": "Amount", "score": 27},
    {"field": "Date", "score": 18},
    {"field": "Vendor", "score": 17},
    {"field": "Category", "score": 16},
    {"field": "Currency", "score": 10},
]

POLICY_DATA = [
    {"result": "Correct Detection", "count": 190},
    {"result": "Missed Violation", "count": 6},
    {"result": "False Positive", "count": 4},
]

DUPLICATE_DATA = [
    {"name": "Precision", "value": 85},
    {"name": "Recall", "value": 80},
]

HITL_DATA = [
    {"stage": "Auto Approved", "count": 420},
    {"stage": "Flagged", "count": 120},
    {"stage": "Escalated", "count": 60},
]

TAXONOMY_DATA = [
    { "name": "Correct L1 & L2", "value": 70 },
    { "name": "Correct L1 Only", "value": 20 },
    { "name": "Incorrect", "value": 10 },
]
ANOMALY_DATA = [
    { "name": "Detected", "value": 75 },
    { "name": "Missed", "value": 25 },
]
RISK_BAND_DATA  =[
    { "band": "Low", "ai": 40, "sme": 42 },
    { "band": "Medium", "ai": 35, "sme": 33 },
    { "band": "High", "ai": 25, "sme": 25 },
]
CONFIDENCE_DATA = [
    { "confidence": "High", "corrected": 5 },
    { "confidence": "Medium", "corrected": 20 },
    { "confidence": "Low", "corrected": 75 },
]
FILE_SCORE_CARD_DATA = [
    {
        "file": "Taxi Normal",
        "ocr": 98,
        "extraction": 95,
        "rules": 100,
        "dup": "N/A",
        "risk": 90,
        "decision": "✔",
    },
    {
        "file": "Taxi Duplicate",
        "ocr": 96,
        "extraction": 94,
        "rules": 100,
        "dup": "✔",
        "risk": 88,
        "decision": "✔",
    },
    {
        "file": "Foreign Currency",
        "ocr": 92,
        "extraction": 90,
        "rules": 95,
        "dup": "N/A",
        "risk": 85,
        "decision": "✔",
    },
    {
        "file": "Blurry Receipt",
        "ocr": 65,
        "extraction": 70,
        "rules": 90,
        "dup": "N/A",
        "risk": 75,
        "decision": "✔",
    },
]
