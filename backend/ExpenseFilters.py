from typing import Optional
from pydantic import BaseModel

class ExpenseFilters(BaseModel):
    category: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    