from fastapi import APIRouter, Query

from app.api.deps import CurrentUserDep
from app.schemas.common import PageMeta
from app.schemas.network import EntitySearchResponse, NetworkGraphResponse, NetworkMetrics
from app.services.mock_data import ENTITIES, graph, metrics

router = APIRouter()


@router.get("/graph", response_model=NetworkGraphResponse)
async def get_graph(_: CurrentUserDep, case_id: str | None = None, entity_id: str | None = None, depth: int = Query(2, ge=1, le=5)) -> NetworkGraphResponse:
    return graph()


@router.get("/entities", response_model=EntitySearchResponse)
async def search_entities(_: CurrentUserDep, search: str | None = None, entity_type: str | None = Query(default=None, alias="type"), page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100)) -> EntitySearchResponse:
    items = [item for item in ENTITIES if (not search or search.lower() in item.label.lower()) and (not entity_type or item.type.value == entity_type)]
    start = (page - 1) * page_size
    return EntitySearchResponse(items=items[start:start + page_size], meta=PageMeta(page=page, page_size=page_size, total=len(items)))


@router.get("/metrics", response_model=NetworkMetrics)
async def get_metrics(_: CurrentUserDep, case_id: str | None = None) -> NetworkMetrics:
    return metrics()
