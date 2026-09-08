from pydantic import Field

from app.schemas.common import StrictModel


class ExtractedEntitySchema(StrictModel):
    text: str
    label: str
    start: int = Field(ge=0)
    end: int = Field(ge=0)


class IngestionResponse(StrictModel):
    document_id: str
    text_length: int = Field(ge=0)
    entities: list[ExtractedEntitySchema]
    normalized_entities: dict[str, list[str]]


class RiskExplanationResponse(StrictModel):
    entity_id: str
    score: float = Field(ge=0, le=1)
    base_value: float
    contributions: dict[str, float]


class SemanticSearchRequest(StrictModel):
    vector: list[float] = Field(min_length=1)
    limit: int = Field(default=5, ge=1, le=100)


class SemanticSearchResponse(StrictModel):
    results: list[dict]
