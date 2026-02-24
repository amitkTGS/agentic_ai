def validate_rules(expense):
    violations = []

    # Meal cap example
    if expense["category"] == "food" and expense["total_amount"] > 10000:
        violations.append({
            "rule_id": "MEAL_CAP",
            "severity": "High",
            "description": "Meal expense exceeds daily limit of ₹10000."
        })

    # Travel cap
    if expense["category"] == "travel" and expense["total_amount"] > 5000:
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
def validate_healthcare_rules(claim):
    violations = []

    # Hospital claim limit
    if claim["total_amount"] > 500000:
        violations.append({
            "rule_id": "HOSPITAL_CLAIM_LIMIT",
            "severity": "High",
            "description": "Hospital claim exceeds ₹5,00,000 limit."
        })

    # Missing diagnosis check
    if not claim.get("vendor"):
        violations.append({
            "rule_id": "MISSING_DIAGNOSIS",
            "severity": "High",
            "description": "Hospital Name missing from hospital bill."
        })
    return violations