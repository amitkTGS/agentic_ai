from pydantic import BaseModel


class Metrics(BaseModel):
    ocr: float
    extraction: float
    policy: float
    duplicate: float
    decision: float


class MetricsResponse(BaseModel):
    metrics: Metrics
    cas: float
