from rag import store_policy

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

for policy in POLICIES:
    store_policy(policy["text"], policy["id"])

print("✅ Expense policies successfully ingested into ChromaDB")
