"""
Auth router — /api/login, /api/me, /api/health
"""
from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies import get_current_user
from app.models.auth import LoginRequest, TokenResponse, UserResponse
from app.services.auth import create_access_token
from app.services.users import authenticate_user

router = APIRouter(prefix="/api")


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest):
    """Exchange username + password for a JWT."""
    user = authenticate_user(body.username, body.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token(data={"sub": user["username"]})
    return TokenResponse(access_token=token, token_type="bearer")


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Return the profile of the currently authenticated user."""
    return UserResponse(
        username=current_user["username"],
        full_name=current_user["full_name"],
    )


@router.get("/health")
async def health():
    """Simple health-check endpoint."""
    return {"status": "ok"}
