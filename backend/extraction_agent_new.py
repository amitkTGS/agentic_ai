import anthropic
import json
import os

client = anthropic.Anthropic(
    api_key=""
)

SYSTEM_PROMPT = """
You are an extraction agent. Read receipts and return structured fields:
(date, vendor, amount, category, currency) in JSON. 
If uncertain, set fields as null. No hallucination.
"""
def extract_fields_with_rag(ocr_text: str, policy_context: str):

    prompt = f"""
            You are an expense receipt extraction assistant.

            ### Expense Policy Context (use this to reason):
            {policy_context}

            ### Task:
            Extract structured data from the OCR text.

            Schema:
            {{
            "category": "IT Services | Employee Incentive Program | House Keeping Materials | Internet Lease Lines | Learning Development | Gifts | Food | Travel | Accommodation | Office Supplies | Miscellaneous | Other | null",
            "total_amount": number | null,
            "vendor": "string | null",
            "date": "DD-MM-YYYY | null",
            "payment_mode": "online | offline | null"
            }}

            Rules:
            - Convert date to DD-MM-YYYY
            - Use policy context to choose correct category
            - If unsure, return null

            OCR TEXT:
            <<<
            {ocr_text}
            >>>

            FINAL OUTPUT REQUIREMENT (VERY STRICT):
            Return ONLY a raw JSON object.
            Do NOT wrap in ```json or ``` 
            Do NOT include backticks
            Do NOT include explanations
            Do NOT include leading or trailing characters
            The first character must be {{ and the last character must be }}
            If you break this rule the response is invalid.
            """

    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=500,
        temperature=0,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    print("response received:")
    print(response.content[0].text)
    return response.content[0].text

def extract_fields_with_rag_health_care(ocr_text: str, policy_context: str):
    prompt = f"""
        You are a healthcare OPD bill extraction assistant.

        ### Medical Policy Context (use this to reason):
        {policy_context}

        ### Task:
        Read hospital OPD bills and extract structured medical billing information.

        Schema:
        {{
        "vendor": "string | null",
        "doctor_name": "string | null",
        "department": "string | null",
        "visit_type": "OPD | IPD | Diagnostic | Pharmacy | null",
        "consultation_charges": number | null,
        "tests_charges": number | null,
        "total_amount": number | null,
        "date": "DD-MM-YYYY | null",
        "patient_name":"string | null",
        "category": "treatment_category | provider_type | compilance_code | null"
        }}

        Rules:
        - vendor should capture the entity issuing the bill (hospital, clinic, lab, pharmacy, diagnostic center, etc.)
        - If bill content relates to treatment (consultation, surgery, medication) → category = treatment_category
        - If bill content relates to hospital/clinic/lab identity → category = provider_type
        - If bill references ICD or CPT codes → category = compilance_code
        - Detect if bill is OPD consultation (doctor visit without admission)
        - Extract doctor's name (Dr., MD, MBBS, Specialist etc.)
        - Extract consultation fee separately from lab tests
        - If lab tests exist, populate tests_charges
        - Convert all dates to DD-MM-YYYY
        - Never guess values — if unsure return null
        - Ignore GST, invoice numbers, phone numbers
        - Do NOT classify pharmacy medicine purchases as OPD
        - Use policy context to validate classification

        OCR TEXT:
        <<<
        {ocr_text}
        >>>

        FINAL OUTPUT REQUIREMENT (VERY STRICT):
        Return ONLY a raw JSON object.
        Do NOT wrap in ```json or ```
        Do NOT include backticks
        Do NOT include explanations
        Do NOT include leading or trailing characters
        The first character must be {{ and the last character must be }}
        If you break this rule the response is invalid.
        """


    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=500,
        temperature=0,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    print("response received:")
    print(response.content[0].text)
    return response.content[0].text
