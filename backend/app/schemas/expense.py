from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional, Dict

# This schema defines what data your phone MUST send when creating an expense
class ExpenseCreate(BaseModel):
    amount: float = Field(..., gt=0)
    category: str
    description: str | None = None
    payment_method: str
    created_at: Optional[str] = None


# This schema defines what data your API will send BACK to your phone
class ExpenseResponse(BaseModel):
    id: str
    amount: float
    category: str
    description: str | None
    payment_method: str
    created_at: datetime

    # This configuration tells Pydantic to read data directly from database models
    class Config:
        from_attributes = True



class TimeframeTotals(BaseModel):
    week: float
    month: float
    year: float

class DailyBarChartItem(BaseModel):
    date_label: str  # e.g., "6th", "7th", "10th"
    amount: float

class DashboardDataResponse(BaseModel):
    timeframe_totals: TimeframeTotals
    bar_chart: List[DailyBarChartItem]
    last_transaction: Optional[ExpenseResponse] = None


class CalendarQueryRequest(BaseModel):
    month: int  # 1-12
    year: int   # e.g., 2026

class DailyCalendarGroup(BaseModel):
    total: float
    transactions: List[ExpenseResponse]


class CalendarDataResponse(BaseModel):
    # Dynamic dictionary mapping "YYYY-MM-DD" -> DailyCalendarGroup
    data: Dict[str, DailyCalendarGroup]