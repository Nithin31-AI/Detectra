from fastapi import APIRouter, HTTPException, Query

from app.api.deps import CurrentUserDep
from app.schemas.alerts import AlertListResponse, AlertStatusUpdate
from app.schemas.common import PageMeta
from app.services import mock_data

router = APIRouter()


@router.get("", response_model=AlertListResponse)
async def list_alerts(_: CurrentUserDep, severity: str | None = None, status_filter: str | None = Query(default=None, alias="status"), search: str | None = None, page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100)) -> AlertListResponse:
    items = [a for a in mock_data.ALERTS if (not severity or a.severity.value == severity.upper()) and (not status_filter or a.status.value.lower() == status_filter.lower()) and (not search or search.lower() in f"{a.title} {a.entity} {a.description}".lower())]
    start = (page - 1) * page_size
    counts = {key: sum(1 for alert in mock_data.ALERTS if alert.severity.value == key) for key in ("CRITICAL", "HIGH", "MEDIUM", "LOW")}
    return AlertListResponse(items=items[start:start + page_size], meta=PageMeta(page=page, page_size=page_size, total=len(items)), counts=counts)


@router.patch("/{alert_id}", response_model=dict[str, str])
async def update_alert(alert_id: str, payload: AlertStatusUpdate, _: CurrentUserDep) -> dict[str, str]:
    if not any(alert.id == alert_id for alert in mock_data.ALERTS):
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"id": alert_id, "status": payload.status.value}
