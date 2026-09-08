from datetime import datetime

from fastapi import APIRouter, HTTPException, status

from app.api.deps import AdminDep
from app.schemas.cases import ApproveRequest, CaseDetail, CaseMonitorItem, CreateCaseRequest
from app.schemas.common import CaseStatus
from app.services.case_service import case_service
from app.services.pubsub import RealtimeBroadcaster
from app.infrastructure.redis_client import redis
from app.worker import process_evidence, reindex_graph

router = APIRouter()
broadcaster = RealtimeBroadcaster(redis)

# ---------------------------------------------------------------------------
# Existing admin utility endpoints
# ---------------------------------------------------------------------------


@router.post("/graph/reindex", response_model=dict[str, str])
async def reindex(_: AdminDep) -> dict[str, str]:
    task = reindex_graph.delay()
    return {"job_id": task.id, "status": "queued"}


@router.post("/evidence/{evidence_id}/process", response_model=dict[str, str])
async def process(evidence_id: str, _: AdminDep) -> dict[str, str]:
    task = process_evidence.delay(evidence_id)
    return {"job_id": task.id, "status": "queued"}


@router.post("/broadcast/{channel}", response_model=dict[str, int])
async def broadcast(channel: str, event: dict, _: AdminDep) -> dict[str, int]:
    return {"subscribers": await broadcaster.publish(channel, event)}


# ---------------------------------------------------------------------------
# Case Creation — Admin Only
# ---------------------------------------------------------------------------


@router.post(
    "/cases/",
    response_model=CaseDetail,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new investigation case (admin only)",
)
async def admin_create_case(payload: CreateCaseRequest, current_admin: AdminDep) -> CaseDetail:
    """Admin-only case creation. Allows assigning an investigator at creation time."""
    return await case_service.create(payload, current_admin.id)


# ---------------------------------------------------------------------------
# Investigation Progress Monitoring
# ---------------------------------------------------------------------------


@router.get(
    "/monitoring/cases",
    response_model=list[CaseMonitorItem],
    summary="Monitoring dashboard — all cases with processing status",
)
async def monitoring_cases(_: AdminDep) -> list[CaseMonitorItem]:
    """
    Returns a monitoring view of all cases including evidence count,
    investigator assignment, approval status, and background job status.
    """
    cases = await case_service.all_cases()

    _job_status_map: dict[CaseStatus, str] = {
        CaseStatus.active: "processing",
        CaseStatus.investigating: "processing",
        CaseStatus.approved: "complete",
        CaseStatus.closed: "complete",
    }

    return [
        CaseMonitorItem(
            id=c.id,
            title=c.title,
            status=c.status,
            priority=c.priority,
            evidence_count=len(c.evidence),
            assigned_to=c.assigned_to,
            updated_at=c.updated_at,
            approved_by=c.approved_by,
            approved_at=c.approved_at,
            job_status=_job_status_map.get(c.status, "idle"),
        )
        for c in cases
    ]


# ---------------------------------------------------------------------------
# Case Report Approval & Sign-off
# ---------------------------------------------------------------------------


@router.post(
    "/cases/{case_id}/approve",
    response_model=CaseDetail,
    summary="Approve and sign off an investigation report",
)
async def approve_case(case_id: str, payload: ApproveRequest, current_admin: AdminDep) -> CaseDetail:
    """
    Marks the case as Approved. Stamps:
    - admin user ID as approved_by
    - current UTC timestamp as approved_at
    - optional sign-off notes
    """
    result = await case_service.approve(case_id, current_admin.id, payload.notes)
    if result is None:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found")
    return result
