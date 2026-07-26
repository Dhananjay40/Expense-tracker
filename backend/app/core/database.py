from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
import os

# 1. Database URL (We use SQLite locally for easy setup, changing to Postgres later is simple)

# DATABASE_URL = "sqlite+aiosqlite:///./expense_tracker.db"  # old
# DATABASE_URL = "postgresql+asyncpg://neondb_owner:npg_wXM1kGgSo8pW@ep-billowing-flower-azff1o8m.c-3.ap-southeast-1.aws.neon.tech/neondb"  # Update with your Postgres credentials

DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql+asyncpg://neondb_owner:npg_wXM1kGgSo8pW@ep-billowing-flower-azff1o8m.c-3.ap-southeast-1.aws.neon.tech/neondb"
)

# 2. Create the Async Engine
engine = create_async_engine(DATABASE_URL, echo=True, connect_args={"ssl": "require"})

# 3. Create a Session Factory
SessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# 4. Create the Base class for our models
class Base(DeclarativeBase):
    pass

# 5. Dependency injection function to get database sessions
async def get_db():
    async with SessionLocal() as session:
        yield session