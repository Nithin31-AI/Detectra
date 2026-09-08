from pydantic import Field

from app.schemas.common import StrictModel


class LoginRequest(StrictModel):
    username: str = Field(min_length=3, max_length=320)
    password: str = Field(min_length=8, max_length=128)


class TokenResponse(StrictModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class CurrentUser(StrictModel):
    id: str
    username: str
    role: str
