from uuid import uuid4

from fastapi import APIRouter

from app.api.deps import CurrentUserDep
from app.schemas.assistant import AssistantQuery, AssistantResponse, Citation

router = APIRouter()


@router.post("/query", response_model=AssistantResponse)
async def query_assistant(payload: AssistantQuery, _: CurrentUserDep) -> AssistantResponse:
    context = payload.entity or payload.case_id or "the investigation network"
    answer = f"Investigation context for {context}: prioritize high-risk entities, trace wallet relationships, and validate evidence anchors before drawing conclusions."
    return AssistantResponse(answer=answer, conversation_id=payload.conversation_id or str(uuid4()), citations=[Citation(source_type="demo", source_id="network-summary", excerpt="Graph and risk context are available in the current investigation workspace.")], confidence=0.62, model="demo-rag")
