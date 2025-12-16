from openai import OpenAI
client = OpenAI()

SYSTEM_PROMPT = """
You are an extraction agent. Read receipts and return structured fields:
(date, vendor, amount, category, currency) in JSON. 
If uncertain, set fields as null. No hallucination.
"""

def extract_fields(ocr_text: str):
    response = client.chat.completions.create(
        model="gpt-5.1-mini",
        messages=[
            {"role":"system","content":SYSTEM_PROMPT},
            {"role":"user","content":f"Extract fields from the following OCR text:\n{ocr_text}"}
        ]
    )
    return response.choices[0].message.content
