from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.api.deps import CurrentUserDep
from app.core.config import get_settings
from app.core.security import create_access_token
from app.services.auth_service import user_service
from app.schemas.auth import CurrentUser, TokenResponse

router = APIRouter()


@router.post("/token", response_model=TokenResponse)
async def login(form: OAuth2PasswordRequestForm = Depends()) -> TokenResponse:
    user = user_service.authenticate(form.username, form.password)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    settings = get_settings()
    return TokenResponse(access_token=create_access_token(user.id, user.role, user.username), expires_in=settings.access_token_expire_minutes * 60)


@router.get("/me", response_model=CurrentUser)
async def me(current_user: CurrentUserDep) -> CurrentUser:
    return current_user
