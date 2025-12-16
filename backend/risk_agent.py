def compute_risk(violations, duplicate_prob):

    rule_score = min(len(violations) * 0.2, 1.0)
    total_score = rule_score * 0.4 + duplicate_prob * 0.4

    if duplicate_prob > 0.7 or any(v["severity"] == "High" for v in violations):
        risk = "High"
    elif total_score > 0.4:
        risk = "Medium"
    else:
        risk = "Low"

    return risk, total_score
