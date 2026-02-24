def decide(risk_level):
    if risk_level == "Low":
        return "approved", "All checks passed. Auto-approved."
    elif risk_level == "Medium":
        return "flagged", "Some issues found; requires manual review."
    return "rejected", "Critical issues found; auto-rejected."