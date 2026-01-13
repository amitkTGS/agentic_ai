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
