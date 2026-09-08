from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class RiskLevel(StrEnum):
    critical = "CRITICAL"
    high = "HIGH"
    medium = "MEDIUM"
    low = "LOW"


class CaseStatus(StrEnum):
    active = "Active"
    investigating = "Investigating"
    approved = "Approved"
    closed = "Closed"


class AlertStatus(StrEnum):
    new = "New"
    investigating = "Investigating"
    resolved = "Resolved"


class EntityType(StrEnum):
    person = "Person"
    wallet = "Wallet"
    device = "Device"
    phone = "Phone"
    ip = "IP"
    network = "Network"


class PageMeta(StrictModel):
    page: int = Field(ge=1)
    page_size: int = Field(ge=1, le=100)
    total: int = Field(ge=0)


class HealthResponse(StrictModel):
    status: str
    service: str
    environment: str
    dependencies: dict[str, str]
    checked_at: datetime
