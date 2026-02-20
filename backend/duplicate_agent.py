from rapidfuzz import fuzz

def duplicate_probability(current, previous_list):
    scores = []

    for prev in previous_list:
        s1 = fuzz.ratio(current["vendor"], prev.vendor)
        s2 = fuzz.ratio(str(current["total_amount"]), str(prev.total_amount))
        s3 = fuzz.ratio(current["date"], prev.date)

        score = (s1 + s2 + s3) / 300  # Normalize to 0-1
        scores.append(score)

    return max(scores) if scores else 0.0

def duplicate_probability_healthcare(current, previous_list):
    scores = []

    for prev in previous_list:
        s1 = fuzz.ratio(current["vendor"], prev.vendor)
        s2 = fuzz.ratio(str(current["total_amount"]), str(prev.total_amount))
        s3 = fuzz.ratio(current["date"], prev.date)
        s4 = fuzz.ratio(current.get("patient_name", ""), getattr(prev, "patient_name", ""))

        score = (s1 + s2 + s3 + s4) / 400  # Normalize to 0-1
        scores.append(score)

    return max(scores) if scores else 0.0
