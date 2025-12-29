from openai import OpenAI
import json
client = OpenAI()

SYSTEM_PROMPT = """
You are an extraction agent. Read receipts and return structured fields:
(date, vendor, amount, category, currency) in JSON. 
If uncertain, set fields as null. No hallucination.
"""

def extract_fields(ocr_text: str):
    response = client.responses.create(
        model="gpt-4.1-mini",
        # model="gpt-4o-mini",
        # messages=[
        #     {"role":"system","content":SYSTEM_PROMPT},
        #     {"role":"user","content":f"Extract fields from the following OCR text:\n{ocr_text}"}
        # ],
        # timeout=20
        # input=SYSTEM_PROMPT
        # input=f"Extract fields from the following OCR text:\n{ocr_text}"
        # input=f"Extract fields from the following OCR text and category it as food or travel and extract total amount and send result in json format:\n{ocr_text}"
        # response_format={
        #     "type": "json_schema",
        #     "json_schema": {
        #         "name": "bill",
        #         "schema": {
        #             "type": "object",
        #             "properties": {
        #                 "category": {"type": "string"},
        #                 "total_amount": {"type": "number"},
        #                 "vendor": {"type": "string"},
        #               "date": {"type": "string", "format": "date"},
        #             },
        #             "required": ["category", "total_amount"]
        #         }
        #     }
        # },
        input=f"""
                Extract structured data from the OCR text below.

                Return JSON ONLY in this format  and strictly don't add \n:
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
        )
    
    print('response received:')
    # return response.choices[0].message.content
    return response.output_text


# def extract_fields(file_path: str):
    
#     file = client.files.create(
#         file=open(file_path, "rb"),
#         purpose="assistants"
#     )

#     response = client.responses.create(
#     model="gpt-4.1",
#     input=[
#             {
#                 "role": "user",
#                 "content": [
#                     {"type": "input_text", "text": "Extract all text from this PDF accurately."},
#                     {"type": "input_file", "file_id": file.id}
#                 ]
#             }
#         ]
#     )

#     print(response.output_text)

