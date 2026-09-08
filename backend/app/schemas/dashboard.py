from datetime import datetime

from pydantic import Field

from app.schemas.common import StrictModel


class DashboardKpis(StrictModel):
    active_cases: int = Field(ge=0)
    entities_analyzed: int = Field(ge=0)
    active_alerts: int = Field(ge=0)
    wallets_analyzed: int = Field(ge=0)


class DashboardAlert(StrictModel):
    title: str
    entity: str
    severity: str
    created_at: datetime


class DashboardResponse(StrictModel):
    kpis: DashboardKpis
    recent_alerts: list[DashboardAlert]
    risk_distribution: dict[str, int]
    generated_at: datetime
