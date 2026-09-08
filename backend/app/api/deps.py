from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.security import decode_access_token
from app.core.config import get_settings
from app.schemas.auth import CurrentUser

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token", auto_error=False)


async def get_current_user(token: Annotated[str | None, Depends(oauth2_scheme)]) -> CurrentUser:
    if token is None:
        if get_settings().require_authentication:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
        return CurrentUser(id="demo-user", username="demo@example.com", role="demo")
    try:
        payload = decode_access_token(token)
        return CurrentUser(id=payload["sub"], username=payload.get("username", payload["sub"]), role=payload.get("role", "investigator"))
    except (ValueError, KeyError) as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials") from exc


CurrentUserDep = Annotated[CurrentUser, Depends(get_current_user)]


def require_roles(*roles: str):
    async def dependency(current_user: CurrentUserDep) -> CurrentUser:
        if current_user.role == "demo":
            return current_user
        if current_user.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return current_user

    return dependency


async def get_current_admin_user(current_user: CurrentUserDep) -> CurrentUser:
    if not get_settings().require_authentication and current_user.role == "demo":
        return current_user
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required",
        )
    return current_user


InvestigatorDep = Annotated[CurrentUser, Depends(require_roles("investigator", "analyst", "admin"))]
AdminDep = Annotated[CurrentUser, Depends(get_current_admin_user)]

