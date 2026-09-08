from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import AuditLogModel, CaseModel, UserModel


class UserRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def by_username(self, username: str) -> UserModel | None:
        return await self.session.scalar(select(UserModel).where(UserModel.username == username.lower()))


class CaseRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def by_id(self, case_id: str) -> CaseModel | None:
        return await self.session.get(CaseModel, case_id)

    async def list(self, status: str | None = None, search: str | None = None) -> list[CaseModel]:
        query = select(CaseModel).order_by(CaseModel.updated_at.desc())
        if status:
            query = query.where(CaseModel.status == status)
        if search:
            query = query.where(CaseModel.title.ilike(f"%{search}%"))
        return list((await self.session.scalars(query)).all())

    async def save(self, case: CaseModel) -> CaseModel:
        self.session.add(case)
        await self.session.commit()
        await self.session.refresh(case)
        return case


class AuditRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def record(self, actor_id: str, action: str, resource_type: str, resource_id: str, details: dict, case_id: str | None = None) -> AuditLogModel:
        item = AuditLogModel(actor_id=actor_id, action=action, resource_type=resource_type, resource_id=resource_id, details=details, case_id=case_id)
        self.session.add(item)
        await self.session.commit()
        return item
