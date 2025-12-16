from paddleocr import PaddleOCR

ocr_model = PaddleOCR(lang='en')

def run_ocr(image_path: str):
    result = ocr_model.ocr(image_path)
    text = "\n".join([line[1][0] for line in result[0]])
    return text
