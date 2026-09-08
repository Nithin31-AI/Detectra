"""Full workflow checks with explicit local/mock and live-service modes.

Run local checks with: pytest tests/e2e/test_full_workflow.py -q
Run provider-backed checks with: E2E_LIVE_SERVICES=true pytest tests/e2e/test_full_workflow.py -q
"""

import io
import os

import pytest


def test_authentication(api_client):
    response = api_client.post("/api/v1/auth/token", data={"username": "admin@system.local", "password": "AdminPass123!"})
    assert response.status_code == 200
    assert len(response.json()["access_token"]) > 20


def test_case_creation_and_text_ingestion(api_client):
    case = api_client.post("/api/v1/cases", json={"title": "Full Workflow Case", "description": "Evidence workflow", "priority": "HIGH"})
    assert case.status_code == 201

    if os.getenv("E2E_LIVE_SERVICES", "false").lower() != "true":
        pytest.skip("Set E2E_LIVE_SERVICES=true with spaCy model installed for PDF/NER validation")

    report = api_client.post("/api/v1/ingestion/reports", files={"file": ("evidence.txt", io.BytesIO(b"Person A used wallet 0xabc from IP 192.0.2.1"), "text/plain")})
    assert report.status_code == 201
    assert report.json()["entities"]


def test_vector_and_graph_services(live_services):
    pytest.importorskip("qdrant_client")
    pytest.importorskip("neo4j")
    from app.infrastructure.qdrant_client import QdrantVectorStore
    from app.infrastructure.neo4j_client import driver
    from app.schemas.common import EntityType, RiskLevel
    from app.schemas.network import Entity
    from app.services.neo4j_service import Neo4jGraphService
    import asyncio

    async def run() -> None:
        vector_store = QdrantVectorStore()
        try:
            results = await vector_store.search([0.0, 0.0, 0.0], limit=1)
            assert isinstance(results, list)
        finally:
            await vector_store.close()
        graph = Neo4jGraphService(driver)
        await graph.upsert_entity(Entity(id="e2e-full-person", label="E2E Full Person", type=EntityType.person, risk=RiskLevel.low, connections=0, cases=0))
        assert any(item.id == "e2e-full-person" for item in await graph.find_entities("E2E Full Person"))

    asyncio.run(run())


def test_websocket_realtime_connection(api_client):
    with api_client.websocket_connect("/api/v1/ws/events") as websocket:
        connected = websocket.receive_json()
        assert connected == {"type": "connected", "channel": "events"}
