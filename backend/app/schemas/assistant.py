from pydantic import Field

from app.schemas.common import StrictModel


class AssistantQuery(StrictModel):
    question: str = Field(min_length=1, max_length=5_000)
    entity: str | None = Field(default=None, max_length=200)
    case_id: str | None = None
    conversation_id: str | None = None


class Citation(StrictModel):
    source_type: str
    source_id: str
    excerpt: str


class AssistantResponse(StrictModel):
    answer: str
    conversation_id: str
    citations: list[Citation]
    confidence: float = Field(ge=0, le=1)
    model: str
