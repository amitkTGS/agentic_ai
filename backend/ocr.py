import easyocr
from pdf2image import convert_from_path
import fitz  # PyMuPDF
from PIL import Image
import io
import numpy as np


def pdf_to_images(path, zoom=2):
    """
    Convert PDF pages to PIL Images
    zoom=2 gives 2x resolution (recommended for OCR)
    """
    doc = fitz.open(path)
    images = []

    for page in doc:
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat)
        img = Image.open(io.BytesIO(pix.tobytes("png")))
        images.append(img)

    return images


def run_ocr(file_path: str, file_type: str):
    
    if file_type.lower() == 'pdf':

        images = pdf_to_images(file_path, zoom=3)
        reader = easyocr.Reader(["en"], gpu=False)

        ocr_text = []

        for img in images:
            img_np = np.array(img)
            result = reader.readtext(img_np, detail=0, paragraph=True)
            ocr_text.append("\n".join(result))

        full_text = "\n".join(ocr_text)
        return full_text

    else:

        reader = easyocr.Reader(["en"])
        result = reader.readtext(file_path, detail=0)
        text = "\n".join(result)
        return text