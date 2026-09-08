from dataclasses import dataclass

from app.core.security import hash_password, verify_password


@dataclass(frozen=True, slots=True)
class UserRecord:
    id: str
    username: str
    password_hash: str
    role: str
    is_active: bool = True


class UserService:
    def __init__(self) -> None:
        self._users: dict[str, UserRecord] = {
            "investigator@example.com": UserRecord("demo-user", "investigator@example.com", hash_password("demo-password"), "investigator"),
            "admin@system.local": UserRecord("admin-user", "admin@system.local", hash_password("AdminPass123!"), "admin"),
        }

    def authenticate(self, username: str, password: str) -> UserRecord | None:
        user = self._users.get(username.lower())
        if user is None or not user.is_active or not verify_password(password, user.password_hash):
            return None
        return user

    def add_user(self, username: str, password: str, role: str) -> UserRecord:
        normalized = username.lower()
        if normalized in self._users:
            raise ValueError("User already exists")
        user = UserRecord(f"user-{len(self._users) + 1}", normalized, hash_password(password), role)
        self._users[normalized] = user
        return user


user_service = UserService()
