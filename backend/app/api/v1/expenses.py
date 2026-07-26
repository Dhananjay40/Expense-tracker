from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Dict
from datetime import datetime, timedelta, timezone
from sqlalchemy import func
import calendar


from app.core.database import get_db
from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate, ExpenseResponse

# Import our User model and our new security guard dependency
from app.models.user import User
from app.api.v1.auth import get_current_user
from app.schemas.expense import DashboardDataResponse, TimeframeTotals, DailyBarChartItem
from app.schemas.expense import CalendarQueryRequest, CalendarDataResponse, DailyCalendarGroup


# Create an isolated router for expenses
app = APIRouter()

IST_OFFSET = timezone(timedelta(hours=5, minutes=30))


# 1. CREATE ENDPOINT: Saves a new expense to the database
@app.post("/", response_model=ExpenseResponse)
async def create_expense(
        expense_in: ExpenseCreate,
        db: AsyncSession = Depends(get_db),
        user: User = Depends(get_current_user)
    ):
    # Check if a custom date was provided by the UI, otherwise default to now
    if expense_in.created_at:
        try:
            # Parse the incoming "YYYY-MM-DD" string and attach the manual IST offset
            naive_date = datetime.strptime(expense_in.created_at, "%Y-%m-%d")
            # We preserve the current local clock hours/minutes so entries aren't stuck at 00:00 midnight
            now = datetime.now(timezone.utc).astimezone(IST_OFFSET)
            transaction_time = naive_date.replace(
                hour=now.hour, 
                minute=now.minute, 
                second=now.second, 
                tzinfo=IST_OFFSET
            )
        except ValueError:
            # Fallback gracefully if parsing fails
            transaction_time = datetime.now(timezone.utc).astimezone(IST_OFFSET)
    else:
        transaction_time = datetime.now(timezone.utc).astimezone(IST_OFFSET)

    # Strip tzinfo so naive IST datetime is saved into DB
    transaction_time = transaction_time.replace(tzinfo=None)
    
    # Convert Pydantic data into an actual SQLAlchemy Database Model object
    db_expense = Expense(
        amount=expense_in.amount,
        category=expense_in.category,
        description=expense_in.description,
        payment_method=expense_in.payment_method,
        user_id=user.id,
        created_at=transaction_time
    )
    
    # Add the object to your database session pipeline
    db.add(db_expense)
    
    # Commit saves it permanently to the .db file
    await db.commit()
    
    # Refresh retrieves the auto-generated data (like ID and created_at) back from the DB
    await db.refresh(db_expense)
    
    return db_expense


# 3. UPDATE ENDPOINT: Modifies an existing expense by its unique ID
@app.put("/{expense_id}", response_model=ExpenseResponse)
async def update_expense(
    expense_id: str, 
    expense_in: ExpenseCreate, 
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    # Step A: Find the existing expense in our database vault
    result = await db.execute(
                select(Expense)
                .where(Expense.user_id == user.id)
                .where(Expense.id == expense_id)
                )
    db_expense = result.scalar_one_or_none()
    
    # Step B: If it doesn't exist, sound the alarm (Return 404 Not Found)
    if db_expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    # Step C: Overwrite old database values with the fresh data from your phone
    db_expense.amount = expense_in.amount
    db_expense.category = expense_in.category
    db_expense.description = expense_in.description
    db_expense.payment_method = expense_in.payment_method
    
    # Step D: Save changes to the file
    await db.commit()
    await db.refresh(db_expense)
    
    return db_expense

# 2. READ ENDPOINT: Fetches all expenses out of the database
@app.get("/", response_model=List[ExpenseResponse])
async def get_all_expenses(
        db: AsyncSession = Depends(get_db),
        user: User = Depends(get_current_user)
    ):
    # Write an async SQL select query
    result = await db.execute(
                select(Expense)
                .where(Expense.user_id == user.id)
                .order_by(Expense.created_at.desc())
            )
    
    # Extract the rows into a clean Python list
    expenses = result.scalars().all()
    return expenses

# 4. DELETE ENDPOINT: Removes an expense completely
@app.delete("/{expense_id}")
async def delete_expense(
        expense_id: str,
        db: AsyncSession = Depends(get_db),
        user: User = Depends(get_current_user)
    ):
    # Step A: Find the entry
    result = await db.execute(
                select(Expense)
                .where(Expense.user_id == user.id)
                .where(Expense.id == expense_id)
            )
    db_expense = result.scalar_one_or_none()
    
    if db_expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    # Step B: Instruct the database session to delete this specific row object
    await db.delete(db_expense)
    
    # Step C: Commit the deletion permanently
    await db.commit()
    
    # Return a success confirmation message
    return {"message": "Expense deleted successfully", "expense": db_expense}



# DASHBOARD METRICS ENDPOINT: Fetches grouped aggregate statistics
@app.get("/dashboard", response_model=DashboardDataResponse)
async def get_dashboard_metrics(
        db: AsyncSession = Depends(get_db),
        user: User = Depends(get_current_user)
    ):
    today = datetime.now(timezone.utc).astimezone(IST_OFFSET).date()
    
    # --- 1. Compute Timeframe Totals (Week, Month, Year) ---
    start_of_week = datetime.combine(today - timedelta(days=today.weekday()), datetime.min.time())
    start_of_month = datetime.combine(today.replace(day=1), datetime.min.time())
    start_of_year = datetime.combine(today.replace(month=1, day=1), datetime.min.time())
    
    # Query Week Total
    week_res = await db.execute(
        select(func.coalesce(func.sum(Expense.amount), 0.0))
        .where(Expense.user_id == user.id, Expense.created_at >= start_of_week)
    )
    week_total = week_res.scalar() or 0.0

    # Query Month Total
    month_res = await db.execute(
        select(func.coalesce(func.sum(Expense.amount), 0.0))
        .where(Expense.user_id == user.id, Expense.created_at >= start_of_month)
    )
    month_total = month_res.scalar() or 0.0

    # Query Year Total
    year_res = await db.execute(
        select(func.coalesce(func.sum(Expense.amount), 0.0))
        .where(Expense.user_id == user.id, Expense.created_at >= start_of_year)
    )
    year_total = year_res.scalar() or 0.0


    # --- 2. Last 5 Days Expense Array (including today) ---
    bar_chart_data = []
    # Loop backward from 4 days ago up through today
    for i in range(4, -1, -1):
        target_date = today - timedelta(days=i)
        
        # Format the suffix for labels ("6th", "7th", "1st", etc.)
        day_num = target_date.day
        if day_num in [1, 21, 31]: suffix = "st"
        elif day_num in [2, 22]: suffix = "nd"
        elif day_num in [3, 23]: suffix = "rd"
        else: suffix = "th"
        
        date_label = f"{day_num}{suffix}"
        
        # Sum expenses for this precise date block
        day_res = await db.execute(
            select(func.coalesce(func.sum(Expense.amount), 0.0))
            .where(
                Expense.user_id == user.id,
                func.date(Expense.created_at) == target_date
            )
        )
        day_sum = day_res.scalar() or 0.0
        
        bar_chart_data.append(DailyBarChartItem(date_label=date_label, amount=day_sum))


    # --- 3. Last Transaction Entry ---
    last_tx_res = await db.execute(
        select(Expense)
        .where(Expense.user_id == user.id)
        .order_by(Expense.created_at.desc())
        .limit(1)
    )
    last_transaction = last_tx_res.scalar()

    return DashboardDataResponse(
        timeframe_totals=TimeframeTotals(
            week=week_total,
            month=month_total,
            year=year_total
        ),
        bar_chart=bar_chart_data,
        last_transaction=last_transaction
    )


@app.post("/calendar", response_model=CalendarDataResponse)
async def get_calendar_monthly_metrics(
    payload: CalendarQueryRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    try:
        _, num_days = calendar.monthrange(payload.year, payload.month)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid month or year values provided.")

    start_date = datetime(payload.year, payload.month, 1, 0, 0, 0)
    end_date = datetime(payload.year, payload.month, num_days, 23, 59, 59)

    result = await db.execute(
        select(Expense)
        .where(
            Expense.user_id == user.id,
            Expense.created_at >= start_date,
            Expense.created_at <= end_date
        )
        .order_by(Expense.created_at.asc())
    )
    expenses = result.scalars().all()

    calendar_map: Dict[str, DailyCalendarGroup] = {}

    for exp in expenses:
        # Get YYYY-MM-DD directly from the saved naive IST timestamp
        if isinstance(exp.created_at, datetime):
            local_date_str = exp.created_at.strftime("%Y-%m-%d")
        else:
            local_date_str = str(exp.created_at).split("T")[0]
        
        if local_date_str not in calendar_map:
            calendar_map[local_date_str] = DailyCalendarGroup(total=0.0, transactions=[])
        
        calendar_map[local_date_str].total += float(exp.amount)
        calendar_map[local_date_str].transactions.append(exp)

    return CalendarDataResponse(data=calendar_map)