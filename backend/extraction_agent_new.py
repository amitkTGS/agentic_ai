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

def extract_fields(ocr_text: str):

    prompt = f"""
            Extract structured data from the OCR text below.

            Return JSON ONLY in this format and strictly don't add \\n:
            {{
            "category": "Food | Travel | Accommodation | Office Supplies | Miscellaneous | Other | null",
            "total_amount": number | null,
            "vendor": "string | null",
            "date": "DD-MM-YYYY | null",
            "payment_mode":"online | offline | null"
            }}

            Constraint: The "date" must be converted to DD-MM-YYYY format (e.g., 01-12-2022).

            OCR TEXT:
            <<<
            {ocr_text}
            >>>
            """

    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=500,
        temperature=0,
        system=SYSTEM_PROMPT,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    print("response received:")
    return response.content[0].text


def extract_fields_with_rag(ocr_text: str, policy_context: str):

    prompt = f"""
            You are an expense receipt extraction assistant.

            ### Expense Policy Context (use this to reason):
            {policy_context}

            ### Task:
            Extract structured data from the OCR text.

            Schema:
            {{
            "category": "Food | Travel | Accommodation | Office Supplies | Miscellaneous | Other | null",
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
        "hospital_name": "string | null",
        "doctor_name": "string | null",
        "department": "string | null",
        "visit_type": "OPD | IPD | Diagnostic | Pharmacy | null",
        "consultation_charges": number | null,
        "tests_charges": number | null,
        "total_amount": number | null,
        "date": "DD-MM-YYYY | null",
        "category": "Clinical Services → OPD | Clinical Services → IPD | Diagnostics | Pharmacy | null"
        }}

        Rules:
        - Detect if bill is OPD consultation (doctor visit without admission)
        - If only consultation present → category = Clinical Services → OPD
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
