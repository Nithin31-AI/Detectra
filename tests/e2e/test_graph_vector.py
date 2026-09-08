import os

import pytest


def test_graph_entity_upsert(live_services):
    from app.infrastructure.neo4j_client import driver
    from app.schemas.common import EntityType, RiskLevel
    from app.schemas.network import Entity
    from app.services.neo4j_service import Neo4jGraphService

    async def run():
        service = Neo4jGraphService(driver)
        await service.upsert_entity(Entity(id="e2e-person", label="E2E Person", type=EntityType.person, risk=RiskLevel.low, connections=0, cases=0))
        entities = await service.find_entities("E2E Person")
        assert any(item.id == "e2e-person" for item in entities)

    pytest.importorskip("pytest_asyncio")
    import asyncio
    asyncio.run(run())


def test_qdrant_search(live_services):
    pytest.importorskip("qdrant_client")
    from app.infrastructure.qdrant_client import QdrantVectorStore
    import asyncio

    async def run():
        store = QdrantVectorStore()
        try:
            results = await store.search([0.0, 0.0, 0.0], limit=1)
            assert isinstance(results, list)
        finally:
            await store.close()

    asyncio.run(run())
