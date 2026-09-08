from fastapi import APIRouter

from app.api.deps import InvestigatorDep
from app.schemas.ingestion import SemanticSearchRequest, SemanticSearchResponse
from app.infrastructure.qdrant_client import QdrantVectorStore

router = APIRouter()


@router.post("/semantic", response_model=SemanticSearchResponse)
async def semantic_search(payload: SemanticSearchRequest, _: InvestigatorDep) -> SemanticSearchResponse:
    store = QdrantVectorStore()
    try:
        results = await store.search(payload.vector, payload.limit)
        return SemanticSearchResponse(results=results)
    finally:
        await store.close()
