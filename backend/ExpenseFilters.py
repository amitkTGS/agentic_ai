from typing import Optional,List
from pydantic import BaseModel
class ExpenseFilters(BaseModel):
    category: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    module: Optional[str] = None
    status: Optional[str] = None
    
class Rule(BaseModel):
    rule_id: str | None = None
    section: str
    domain: str
    category: str
    condition: str
    action: str
    severity: str
class SaveRequest(BaseModel):
    status:str
    file_name:str
    data:List[Rule]  