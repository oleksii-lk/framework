"""
User service — in-memory user store and credential verification.

Hardcoded to for demo
"""
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# Hardcoded users: {username: hashed_password}
USERS_DB: dict[str, dict] = {
    "alice": {
        "username": "alice",
        "full_name": "Alice Wonderland",
        "hashed_password": pwd_context.hash("password123"),
    },
    "bob": {
        "username": "smith",
        "full_name": "Agent Smith",
        "hashed_password": pwd_context.hash("secret456"),
    },
    "test": {
        "username": "test",
        "full_name": "Test Test",
        "hashed_password": pwd_context.hash("test"),
    },
}


def get_user(username: str) -> dict | None:
    """Return user dict or None if not found."""
    return USERS_DB.get(username)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Return True if the plain password matches the hash."""
    return pwd_context.verify(plain_password, hashed_password)


def authenticate_user(username: str, password: str) -> dict | None:
    """
    Verify credentials and return user dict.
    Returns None if username doesn't exist or password is wrong.
    """
    user = get_user(username)
    if not user:
        return None
    if not verify_password(password, user["hashed_password"]):
        return None
    return user
