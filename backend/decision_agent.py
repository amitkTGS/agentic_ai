def decide(risk_level):
    if risk_level == "Low":
        return "APPROVED", "All checks passed. Auto-approved."
    return "FLAGGED", "Potential issues detected; requires manual review."
