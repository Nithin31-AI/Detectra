import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

os.environ["DEMO_MODE"] = "true"
os.environ["REQUIRE_AUTHENTICATION"] = "false"
os.environ.setdefault("JWT_SECRET_KEY", "e2e-test-secret")
os.environ.setdefault("POSTGRES_DSN", "sqlite+aiosqlite:///:memory:")

from app.core.config import get_settings
get_settings.cache_clear()


@pytest.fixture
def api_client():
    from app.main import app

    with TestClient(app) as client:
        yield client


@pytest.fixture
def admin_token(api_client):
    response = api_client.post("/api/v1/auth/token", data={"username": "admin@system.local", "password": "AdminPass123!"})
    assert response.status_code == 200, response.text
    return response.json()["access_token"]


@pytest.fixture
def live_services():
    if os.getenv("E2E_LIVE_SERVICES", "false").lower() != "true":
        pytest.skip("Set E2E_LIVE_SERVICES=true to run external-service E2E tests")
    return True
