from pydantic import BaseModel, EmailStr, Field

# This validates what the user types when signing up or logging in
class UserAuth(BaseModel):
    # EmailStr checks if the string is formatted as a valid email (e.g., name@domain.com)
    # username: str
    # email: EmailStr 
    identifier: str = Field(..., description="Enter your email address or username")
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters long")


class UserAuthRegister(BaseModel):
    username: str
    email: EmailStr 
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters long")

# This defines the clean account details returned back to the UI
class UserResponse(BaseModel):
    id: str
    username: str
    email: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    email: str
    username: str