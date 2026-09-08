from datetime import datetime

from pydantic import Field, field_validator

from app.schemas.common import CaseStatus, PageMeta, RiskLevel, StrictModel


class CaseSummary(StrictModel):
    id: str
    title: str
    description: str
    status: CaseStatus
    priority: RiskLevel
    suspects: int = Field(ge=0)
    entities: int = Field(ge=0)
    wallets: int = Field(ge=0)
    updated_at: datetime


class CaseListResponse(StrictModel):
    items: list[CaseSummary]
    meta: PageMeta


class Suspect(StrictModel):
    name: str
    role: str
    risk: RiskLevel


class CaseEvidence(StrictModel):
    title: str
    type: str
    status: str


class CaseDetail(CaseSummary):
    risk_score: int = Field(ge=0, le=100)
    suspects_detail: list[Suspect]
    wallets_detail: list[dict[str, str]]
    evidence: list[CaseEvidence]
    findings: list[str]
    assigned_to: str | None = None
    approved_by: str | None = None
    approved_at: datetime | None = None
    sign_off_notes: str | None = None


class CreateCaseRequest(StrictModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1, max_length=10_000)
    priority: RiskLevel = RiskLevel.medium
    assigned_to: str | None = None
    status: CaseStatus = CaseStatus.active

    @field_validator("status", mode="before")
    @classmethod
    def parse_status(cls, value: str | CaseStatus | None) -> CaseStatus:
        if value is None:
            return CaseStatus.active
        return value if isinstance(value, CaseStatus) else CaseStatus(value)

    @field_validator("priority", mode="before")
    @classmethod
    def parse_priority(cls, value: str | RiskLevel) -> RiskLevel:
        return value if isinstance(value, RiskLevel) else RiskLevel(value.upper())



class UpdateCaseRequest(StrictModel):
    status: CaseStatus | None = None
    priority: RiskLevel | None = None
    description: str | None = Field(default=None, max_length=10_000)

    @field_validator("status", mode="before")
    @classmethod
    def parse_status(cls, value: str | CaseStatus | None) -> CaseStatus | None:
        return value if value is None or isinstance(value, CaseStatus) else CaseStatus(value)

    @field_validator("priority", mode="before")
    @classmethod
    def parse_priority(cls, value: str | RiskLevel | None) -> RiskLevel | None:
        return value if value is None or isinstance(value, RiskLevel) else RiskLevel(value.upper())


class ApproveRequest(StrictModel):
    notes: str | None = Field(default=None, max_length=5_000)


class CaseMonitorItem(StrictModel):
    id: str
    title: str
    status: CaseStatus
    priority: RiskLevel
    evidence_count: int
    assigned_to: str | None
    updated_at: datetime
    approved_by: str | None
    approved_at: datetime | None
    job_status: str  # e.g. "idle", "processing", "complete"
