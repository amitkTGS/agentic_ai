def decide(risk_level):
    if risk_level == "Low":
        return "approved", "All checks passed. Auto-approved."
    return "flagged", "Potential issues detected; requires manual review."

def decide_healthcare(risk_level):
    if risk_level == "Low":
        return "approved","All checks passed. Auto-approved."
    return "flagged", "Potential issues detected; requires manual review."