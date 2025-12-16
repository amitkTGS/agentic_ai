def validate_rules(expense):
    violations = []

    # Meal cap example
    if expense["category"] == "Food" and expense["amount"] > 1500:
        violations.append({
            "rule_id": "MEAL_CAP",
            "severity": "Medium",
            "description": "Meal expense exceeds daily limit of ₹1500."
        })

    # Travel cap
    if expense["category"] == "Travel" and expense["amount"] > 5000:
        violations.append({
            "rule_id": "TRAVEL_CAP",
            "severity": "Medium",
            "description": "Travel cost above ₹5000 limit."
        })

    # Missing vendor check
    if not expense["vendor"]:
        violations.append({
            "rule_id": "MISSING_VENDOR",
            "severity": "High",
            "description": "Vendor missing from receipt."
        })

    return violations
