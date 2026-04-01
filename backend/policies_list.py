rules_data = [
  {
    "rule_id": "VEND-R001",
    "section": "3.1 Vendor Onboarding",
    "domain": "VENDOR",
    "category": "COMPLIANCE",
    "condition": "GSTIN is invalid or expired",
    "action": "Flag as invalid GST and request updated document",
    "severity": "MEDIUM",
    "raw_text": "GSTIN invalid or expired FLAG: Invalid GST"
  },
  {
    "rule_id": "VEND-R002",
    "section": "3.1 Vendor Onboarding",
    "domain": "VENDOR",
    "category": "VALIDATION",
    "condition": "PAN and GST entity name mismatch",
    "action": "Flag identity discrepancy for analyst review",
    "severity": "MEDIUM",
    "raw_text": "PAN and GST entity name mismatch FLAG: Identity Discrepancy"
  },
  {
    "rule_id": "VEND-R003",
    "section": "3.1 Vendor Onboarding",
    "domain": "VENDOR",
    "category": "PAYMENT",
    "condition": "Bank account verification (penny-drop) failed",
    "action": "Block payments until resolved",
    "severity": "HIGH",
    "raw_text": "Bank account penny-drop failed FLAG: Bank Unverified Block payments"
  },
  {
    "rule_id": "VEND-R004",
    "section": "3.1 Vendor Onboarding",
    "domain": "VENDOR",
    "category": "COMPLIANCE",
    "condition": "Director name matches sanctions list",
    "action": "Block and escalate to Legal and CISO",
    "severity": "BLOCK",
    "raw_text": "Director name matches sanctions list BLOCK: CRITICAL"
  },
  {
    "rule_id": "VEND-R006",
    "section": "3.1 Vendor Onboarding",
    "domain": "VENDOR",
    "category": "DOCUMENTATION",
    "condition": "Mandatory vendor document is missing",
    "action": "Return submission to vendor with checklist",
    "severity": "MEDIUM",
    "raw_text": "Mandatory document field missing FLAG: Incomplete Submission"
  },
  {
    "rule_id": "INVV-R001",
    "section": "3.2 Invoice Validation",
    "domain": "INVOICE",
    "category": "FRAUD",
    "condition": "Exact duplicate invoice (same invoice number, vendor, and amount)",
    "action": "Block processing",
    "severity": "BLOCK",
    "raw_text": "Exact duplicate same invoice no + vendor + amount BLOCK"
  },
  {
    "rule_id": "INVV-R002",
    "section": "3.2 Invoice Validation",
    "domain": "INVOICE",
    "category": "FRAUD",
    "condition": "Near duplicate invoice within 45 days",
    "action": "Flag high and send for analyst review",
    "severity": "HIGH",
    "raw_text": "Near-duplicate within 45 days FLAG HIGH"
  },
  {
    "rule_id": "INVV-R003",
    "section": "3.2 Invoice Validation",
    "domain": "INVOICE",
    "category": "DOCUMENTATION",
    "condition": "Invoice amount greater than ₹25,000 without linked Purchase Order",
    "action": "Flag and obtain PO before processing",
    "severity": "MEDIUM",
    "raw_text": "Invoice >₹25,000 without linked PO FLAG"
  },
  {
    "rule_id": "INVV-R004",
    "section": "3.2 Invoice Validation",
    "domain": "INVOICE",
    "category": "FINANCIAL",
    "condition": "Invoice amount variance from PO exceeds 10%",
    "action": "Flag and require manager approval",
    "severity": "MEDIUM",
    "raw_text": "Invoice variance from PO >10% FLAG"
  },
  {
    "rule_id": "INVV-R006",
    "section": "3.2 Invoice Validation",
    "domain": "INVOICE",
    "category": "COMPLIANCE",
    "condition": "Vendor status is not active",
    "action": "Block invoice processing",
    "severity": "BLOCK",
    "raw_text": "Vendor status not active BLOCK"
  },
  {
    "rule_id": "PAYR-R001",
    "section": "3.3 Payment Execution",
    "domain": "PAYMENT",
    "category": "FRAUD",
    "condition": "Beneficiary matches blacklist",
    "action": "Block transaction and alert compliance officer",
    "severity": "BLOCK",
    "raw_text": "Blacklist match BLOCK CRITICAL"
  },
  {
    "rule_id": "PAYR-R002",
    "section": "3.3 Payment Execution",
    "domain": "PAYMENT",
    "category": "FINANCIAL",
    "condition": "Single transaction exceeds ₹10,00,000",
    "action": "Require CFO approval",
    "severity": "HIGH",
    "raw_text": "Transaction >₹10,00,000 FLAG High-Value"
  },
  {
    "rule_id": "PAYR-R005",
    "section": "3.3 Payment Execution",
    "domain": "PAYMENT",
    "category": "COMPLIANCE",
    "condition": "Vendor KYC is expired",
    "action": "Block payment and trigger renewal",
    "severity": "BLOCK",
    "raw_text": "KYC expired BLOCK"
  },
  {
    "rule_id": "FRD-SPLIT",
    "section": "4.2 Fraud Detection",
    "domain": "INVOICE",
    "category": "FRAUD",
    "condition": "Invoice splitting pattern detected (multiple invoices below threshold but combined exceeds limit)",
    "action": "Flag high and escalate to Finance Head",
    "severity": "HIGH",
    "raw_text": "Invoice splitting detected FLAG HIGH escalate"
  },
  {
    "rule_id": "DATA-001",
    "section": "9 Data Governance",
    "domain": "GENERAL",
    "category": "DATA_GOVERNANCE",
    "condition": "Processing business data",
    "action": "Use only minimum required data",
    "severity": "MEDIUM",
    "raw_text": "Agents must process only minimum data necessary"
  },
  {
    "rule_id": "DATA-002",
    "section": "9 Data Governance",
    "domain": "GENERAL",
    "category": "PRIVACY",
    "condition": "Handling personally identifiable information (PII)",
    "action": "Mask or tokenize data before storage",
    "severity": "HIGH",
    "raw_text": "All PII must be tokenised or masked"
  }
]