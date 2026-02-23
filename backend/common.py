def fallback_value(extracted_value,form_value):
    if extracted_value in ['null','',None]:
        return form_value
    return extracted_value

CATEGORIES = {
    "food": "food",
    "travel": "travel",
    "accommodation": "accommodation",
    "office_supplies": "office_supplies",
    "miscellaneous": "miscellaneous",
    "other": "other"
}
HEALTH_CARE_CATEGORIES = {
    "compliance_code": "compliance_code",
    "medication": "medication",
    "treatment": "treatment",
    
}

