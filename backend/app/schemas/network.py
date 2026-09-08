from pydantic import Field

from app.schemas.common import EntityType, PageMeta, RiskLevel, StrictModel


class Entity(StrictModel):
    id: str
    label: str
    type: EntityType
    risk: RiskLevel
    connections: int = Field(ge=0)
    cases: int = Field(ge=0)


class Edge(StrictModel):
    id: str
    source: str
    target: str
    relationship: str
    weight: float = Field(ge=0)


class NetworkGraphResponse(StrictModel):
    nodes: list[Entity]
    edges: list[Edge]
    meta: PageMeta


class NetworkMetrics(StrictModel):
    degree: dict[str, float]
    betweenness: dict[str, float]
    eigenvector: dict[str, float]
    communities: list[list[str]]


class EntitySearchResponse(StrictModel):
    items: list[Entity]
    meta: PageMeta
