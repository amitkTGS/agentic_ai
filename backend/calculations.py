from typing import List, Dict


def calculate_cas(m: Dict[str, float]) -> float:
    return round(
        m["ocr"] * 0.25 +
        m["extraction"] * 0.30 +
        m["policy"] * 0.20 +
        m["duplicate"] * 0.15 +
        m["decision"] * 0.10,
        2
    )


def ocr_accuracy(data: List[Dict]) -> float:
    correct = sum(x["correct"] for x in data)
    total = sum(x["correct"] + x["incorrect"] for x in data)
    return round((correct / total) * 100, 2)


def extraction_accuracy(data: List[Dict]) -> float:
    total_score = sum(x["score"] for x in data)
    return round((total_score / 100) * 100, 2)


def policy_accuracy(data: List[Dict]) -> float:
    correct = next(x["count"] for x in data if x["result"] == "Correct Detection")
    total = sum(x["count"] for x in data)
    return round((correct / total) * 100, 2)


def duplicate_score(data: List[Dict]) -> float:
    precision = next(x["value"] for x in data if x["name"] == "Precision")
    recall = next(x["value"] for x in data if x["name"] == "Recall")
    return round((precision * 0.6 + recall * 0.4), 2)


def decision_accuracy(data: List[Dict]) -> float:
    auto = next(x["count"] for x in data if x["stage"] == "Auto Approved")
    total = sum(x["count"] for x in data)
    return round((auto / total) * 100, 2)
