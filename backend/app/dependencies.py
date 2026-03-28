"""
FastAPI dependency functions.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.services.auth import decode_access_token
from app.services.users import get_user

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")


def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """
    Decode the Bearer token and return the corresponding user dict.
    Raises HTTP 401 if the token is missing, invalid, or the user no longer exists.

    Usage in a route:
        @router.get("/me")
        async def me(user: dict = Depends(get_current_user)):
            ...
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    username: str | None = payload.get("sub")
    if not username:
        raise credentials_exception

    user = get_user(username)
    if not user:
        raise credentials_exception

    return user
