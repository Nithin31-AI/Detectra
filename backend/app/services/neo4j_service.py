from neo4j import AsyncDriver

from app.schemas.common import EntityType, RiskLevel
from app.schemas.network import Edge, Entity


class Neo4jGraphService:
    def __init__(self, driver: AsyncDriver) -> None:
        self.driver = driver

    async def find_entities(self, search: str | None = None, entity_type: str | None = None, limit: int = 100) -> list[Entity]:
        clauses = []
        parameters: dict[str, object] = {"limit": limit}
        if search:
            clauses.append("toLower(n.label) CONTAINS toLower($search)")
            parameters["search"] = search
        if entity_type:
            clauses.append("n.type = $entity_type")
            parameters["entity_type"] = entity_type
        where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
        query = f"MATCH (n:Entity) {where} OPTIONAL MATCH (n)-[r]-() RETURN n, count(r) AS connections LIMIT $limit"
        async with self.driver.session() as session:
            result = await session.run(query, parameters)
            records = await result.data()
        return [
            Entity(
                id=record["n"]["id"],
                label=record["n"].get("label", record["n"]["id"]),
                type=EntityType(record["n"]["type"]) if record["n"].get("type") in EntityType._value2member_map_ else EntityType.person,
                risk=RiskLevel(record["n"].get("risk", "LOW")) if record["n"].get("risk", "LOW") in RiskLevel._value2member_map_ else RiskLevel.low,
                connections=record["connections"],
                cases=record["n"].get("cases", 0),
            )
            for record in records
        ]

    async def graph(self, case_id: str | None = None, depth: int = 2) -> tuple[list[Entity], list[Edge]]:
        query = "MATCH p=(a:Entity)-[*1..$depth]-(b:Entity) WHERE $case_id IS NULL OR $case_id IN coalesce(a.case_ids, []) RETURN nodes(p) AS nodes, relationships(p) AS relationships"
        async with self.driver.session() as session:
            result = await session.run(query, depth=depth, case_id=case_id)
            records = await result.data()
        entities: dict[str, Entity] = {}
        edges: dict[str, Edge] = {}
        for record in records:
            for node in record["nodes"]:
                node_type = EntityType(node["type"]) if node.get("type") in EntityType._value2member_map_ else EntityType.person
                node_risk = RiskLevel(node.get("risk", "LOW")) if node.get("risk", "LOW") in RiskLevel._value2member_map_ else RiskLevel.low
                entities[node["id"]] = Entity(
                    id=node["id"],
                    label=node.get("label", node["id"]),
                    type=node_type,
                    risk=node_risk,
                    connections=0,
                    cases=len(node.get("case_ids", [])),
                )
            for relationship in record["relationships"]:
                edge_id = str(relationship.element_id)
                edges[edge_id] = Edge(id=edge_id, source=relationship.start_node.element_id, target=relationship.end_node.element_id, relationship=relationship.type, weight=float(relationship.get("weight", 1)))
        return list(entities.values()), list(edges.values())

    async def upsert_entity(self, entity: Entity) -> None:
        query = "MERGE (n:Entity {id: $id}) SET n.label=$label, n.type=$type, n.risk=$risk, n.cases=$cases"
        async with self.driver.session() as session:
            await session.run(query, id=entity.id, label=entity.label, type=entity.type.value, risk=entity.risk.value, cases=entity.cases)

    async def upsert_relationship(self, source: str, target: str, relationship: str, weight: float = 1) -> None:
        query = "MATCH (a:Entity {id: $source}), (b:Entity {id: $target}) MERGE (a)-[r:RELATED {kind: $relationship}]->(b) SET r.weight=$weight"
        async with self.driver.session() as session:
            await session.run(query, source=source, target=target, relationship=relationship, weight=weight)
