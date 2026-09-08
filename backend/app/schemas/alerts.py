from datetime import datetime

from pydantic import Field

from app.schemas.common import AlertStatus, PageMeta, RiskLevel, StrictModel


class Alert(StrictModel):
    id: str
    title: str
    description: str
    severity: RiskLevel
    status: AlertStatus
    entity: str
    created_at: datetime
    risk_score: int = Field(ge=0, le=100)
    recommendation: str


class AlertListResponse(StrictModel):
    items: list[Alert]
    meta: PageMeta
    counts: dict[str, int]


class AlertStatusUpdate(StrictModel):
    status: AlertStatus
