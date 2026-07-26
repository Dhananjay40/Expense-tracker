from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from typing import List

# Import our database infrastructure
from app.core.database import engine, Base, get_db
# Import our database model (the SQL table)
from app.models.expense import Expense
# Import our data verification systems (Pydantic schemas)
from app.schemas.expense import ExpenseCreate, ExpenseResponse
from app.api.v1.expenses import app as expenses_router
from app.api.v1.auth import router as auth_router

# 1. Define the Lifespan Manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Everything before 'yield' runs when the server starts up
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield  # The server runs while paused here
    
    # Everything after 'yield' runs when the server shuts down (Clean up pipes if needed)

# 2. Pass the lifespan manager directly into the FastAPI instance
app = FastAPI(title="Personal Expense Tracker API", lifespan=lifespan)

app.include_router(expenses_router, prefix="/api/v1/expenses", tags=["Expenses"])
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://spenditto.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "running"}
