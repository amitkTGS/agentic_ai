def compute_risk(violations, duplicate_prob):
    has_high = any(v["severity"] == "High" for v in violations)
    rule_score = min(len(violations) * 0.2, 1.0)
    total_score = rule_score * 0.4 + duplicate_prob * 0.4
    is_duplicate = duplicate_prob >=  0.9  # or >= 0.95 depending on scale

    if has_high and is_duplicate:
        risk = "High"
    elif has_high or is_duplicate:
        risk = "Medium"

    # LOW → Neither present
    else:
        risk = "Low"

    return risk,total_score