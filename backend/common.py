def fallback_value(extracted_value,form_value):
    if extracted_value in ['null','',None]:
        return form_value
    return extracted_value

CATEGORIES = {
    "it_services":"it_services",
    "employee_incentive_program":"employee_incentive_program",
    "house_keeping_materials":"house_keeping_materials",
    "internet_lease_lines":"internet_lease_lines",
    "learning_development":"learning_development",
    "gifts":"gifts",
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

