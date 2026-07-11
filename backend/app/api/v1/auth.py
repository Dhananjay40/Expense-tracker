from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
import jwt


from fastapi.security import OAuth2PasswordBearer
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserAuth, UserResponse, UserAuthRegister
from app.core.security import get_password_hash, SECRET_KEY, ALGORITHM
from app.schemas.user import TokenResponse
from app.core.security import verify_password, create_access_token

# This utility tells FastAPI to look for a 'Bearer' token in the Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_in: UserAuthRegister, db: AsyncSession = Depends(get_db)):
    # 1. Check if a user with this email already exists in our database
    result = await db.execute(select(User).where(User.email == user_in.email))
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )
    
    # 2. Hash the user's plain text password safely
    scrambled_password = get_password_hash(user_in.password)
    
    # 3. Create the database record object
    new_user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=scrambled_password
    )
    
    # 4. Save to the database file
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return new_user


@router.post("/login", response_model=TokenResponse)
async def login_user(user_in: UserAuth, db: AsyncSession = Depends(get_db)):

    # 1. Look up the user by their email
    if "@" in user_in.identifier:
        query = select(User).where(User.email == user_in.identifier)
    else:
        query = select(User).where(User.username == user_in.identifier)
        
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    # 2. If user doesn't exist, or password hash doesn't match, fail immediately
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 3. Create the JWT token containing their unique User ID as the subject ('sub')
    token_data = {"sub": user.id}
    jwt_token = create_access_token(data=token_data)
    
    # 4. Return the signed token to the client application
    return {"username": user.username, "email": user.email, "access_token": jwt_token, "token_type": "bearer"}


# NEW DEPENDENCY FUNCTION: The Authentication Guard
async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode the token using our secret key
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
        
    # Fetch the user from the database to ensure they still exist
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if user is None:
        raise credentials_exception
        
    return user


@router.get("/users", response_model=List[UserResponse])
async def get_all_users(db: AsyncSession = Depends(get_db)):
    # Write an async SQL select query
    result = await db.execute(
                select(User)
                .order_by(User.created_at.desc())
            )
    
    # Extract the rows into a clean Python list
    users = result.scalars().all()
    return users