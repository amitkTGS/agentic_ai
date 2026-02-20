from rag import (store_policy,store_healthcare_policy)
POLICIES = [
    {
        "id": "policy_food_1",
        "text": "Food expenses include restaurant bills only. Grocery purchases must be categorized as Office Supplies."
    },
    {
        "id": "policy_food_2",
        "text": "Meal expenses must not exceed ₹1500 per day."
    },
    {
        "id": "policy_travel_1",
        "text": "Travel expenses above ₹5000 require manager approval."
    },
    {
        "id": "policy_accommodation_1",
        "text": "Accommodation expenses above ₹4000 require justification."
    },
    {
        "id": "policy_payment_1",
        "text": "Online payments include UPI, cards, and net banking. Cash payments are considered offline."
    }
]

HEALTHCARE_POLICIES = [
    {
        "id": "healthcare_limit_1",
        "text": "Hospital claims exceeding ₹5,00,000 require senior medical auditor approval."
    },
    {
        "id": "healthcare_diagnosis_1",
        "text": "Every claim must contain a valid diagnosis mentioned in the hospital bill."
    },
    {
        "id": "healthcare_admission_1",
        "text": "Admission and discharge dates must be clearly mentioned in the hospital invoice."
    },
    {
        "id": "healthcare_duplicate_1",
        "text": "Duplicate healthcare claims with same patient, hospital, and admission date are not allowed."
    },
    {
        "id": "healthcare_noncovered_1",
        "text": "Cosmetic procedures are not covered under standard healthcare insurance policies."
    },
    {
        "id": "healthcare_roomlimit_1",
        "text": "Room rent charges exceeding ₹10,000 per day require policy upgrade validation."
    }
]


for policy in POLICIES:
    store_policy(policy["text"], policy["id"])
for policy in HEALTHCARE_POLICIES:
    store_healthcare_policy(policy["text"], policy["id"])

print("✅policies successfully ingested into ChromaDB")
