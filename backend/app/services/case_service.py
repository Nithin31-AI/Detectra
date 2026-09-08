from __future__ import annotations

from datetime import UTC, datetime
from uuid import uuid4

from app.schemas.cases import CaseDetail, CreateCaseRequest, UpdateCaseRequest
from app.schemas.common import CaseStatus, RiskLevel
from app.services import mock_data


class CaseService:
    def __init__(self) -> None:
        self._cases: dict[str, CaseDetail] = {case.id: case for case in mock_data.CASES}

    async def list(self, status: CaseStatus | None, search: str | None) -> list[CaseDetail]:
        return [case for case in self._cases.values() if (status is None or case.status == status) and (not search or search.lower() in f"{case.id} {case.title} {case.description}".lower())]

    async def get(self, case_id: str) -> CaseDetail | None:
        return self._cases.get(case_id)

    async def create(self, payload: CreateCaseRequest, actor_id: str) -> CaseDetail:
        case_id = f"CASE-{len(self._cases) + 1:03d}"
        case = CaseDetail(
            id=case_id,
            title=payload.title,
            description=payload.description,
            status=payload.status,
            priority=payload.priority,
            suspects=0,
            entities=0,
            wallets=0,
            updated_at=datetime.now(UTC),
            risk_score=0,
            suspects_detail=[],
            wallets_detail=[],
            evidence=[],
            findings=[f"Created by {actor_id}."],
            assigned_to=payload.assigned_to,
        )
        self._cases[case_id] = case
        return case

    async def update(self, case_id: str, payload: UpdateCaseRequest) -> CaseDetail | None:
        current = self._cases.get(case_id)
        if current is None:
            return None
        values = payload.model_dump(exclude_none=True)
        self._cases[case_id] = current.model_copy(update={**values, "updated_at": datetime.now(UTC)})
        return self._cases[case_id]

    async def approve(self, case_id: str, admin_id: str, notes: str | None) -> CaseDetail | None:
        current = self._cases.get(case_id)
        if current is None:
            return None
        self._cases[case_id] = current.model_copy(update={
            "status": CaseStatus.approved,
            "approved_by": admin_id,
            "approved_at": datetime.now(UTC),
            "sign_off_notes": notes,
            "updated_at": datetime.now(UTC),
        })
        return self._cases[case_id]

    async def all_cases(self) -> list[CaseDetail]:
        return list(self._cases.values())


case_service = CaseService()
