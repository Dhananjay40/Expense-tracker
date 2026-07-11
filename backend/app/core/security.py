import jwt
import bcrypt
from datetime import datetime, timedelta

# SECURITY CONFIGURATIONS
SECRET_KEY = "SUPER_SECRET_PASSPHRASE_CHANGE_THIS_IN_PRODUCTION"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 7 * 60 * 24  # 1 week

def get_password_hash(password: str) -> str:
    """Takes a plain text password, salts it, and returns a secure string hash."""
    # Convert plain text string into bytes
    password_bytes = password.encode('utf-8')
    # Generate a random salt
    salt = bcrypt.gensalt()
    # Hash the password
    hashed_bytes = bcrypt.hashpw(password_bytes, salt)
    # Convert bytes back to a clean string to store in the database
    return hashed_bytes.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Compares a typed plain password with the stored database hash."""
    plain_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_bytes, hashed_bytes)

def create_access_token(data: dict) -> str:
    """Encodes user data and signs it with our SECRET_KEY."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt