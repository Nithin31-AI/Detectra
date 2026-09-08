from fastapi import APIRouter, HTTPException, Query, status

from app.api.deps import AdminDep, InvestigatorDep
from app.schemas.cases import CaseDetail, CaseListResponse, CreateCaseRequest, UpdateCaseRequest
from app.schemas.common import CaseStatus, PageMeta
from app.services.case_service import case_service

router = APIRouter()


@router.get("", response_model=CaseListResponse)
async def list_cases(_: InvestigatorDep, status_filter: CaseStatus | None = Query(default=None, alias="status"), search: str | None = None, page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100)) -> CaseListResponse:
    items = await case_service.list(status_filter, search)
    start = (page - 1) * page_size
    return CaseListResponse(items=[case for case in items[start:start + page_size]], meta=PageMeta(page=page, page_size=page_size, total=len(items)))


@router.get("/{case_id}", response_model=CaseDetail)
async def get_case(case_id: str, _: InvestigatorDep) -> CaseDetail:
    case = await case_service.get(case_id)
    if case is None:
        raise HTTPException(status_code=404, detail="Case not found")
    return case


@router.post("", response_model=CaseDetail, status_code=status.HTTP_201_CREATED)
async def create_case(payload: CreateCaseRequest, current_user: AdminDep) -> CaseDetail:
    return await case_service.create(payload, current_user.id)



@router.patch("/{case_id}", response_model=CaseDetail)
async def update_case(case_id: str, payload: UpdateCaseRequest, _: InvestigatorDep) -> CaseDetail:
    case = await case_service.update(case_id, payload)
    if case is None:
        raise HTTPException(status_code=404, detail="Case not found")
    return case
