from fastapi import APIRouter

from app.api.deps import CurrentUserDep
from app.schemas.dashboard import DashboardResponse
from app.services.mock_data import dashboard

router = APIRouter()


@router.get("", response_model=DashboardResponse)
async def get_dashboard(_: CurrentUserDep) -> DashboardResponse:
    return dashboard()
