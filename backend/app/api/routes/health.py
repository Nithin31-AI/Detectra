import asyncio
from datetime import UTC, datetime

from fastapi import APIRouter
import httpx
from sqlalchemy import text

from app.core.config import get_settings
from app.infrastructure.database import engine
from app.infrastructure.neo4j_client import driver
from app.infrastructure.redis_client import redis
from app.schemas.common import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    settings = get_settings()
    deps: dict[str, str] = {"api": "ok"}

    # 1. PostgreSQL check
    try:
        async with engine.connect() as conn:
            await asyncio.wait_for(conn.execute(text("SELECT 1")), timeout=2.0)
        deps["postgres"] = "ok"
    except Exception as exc:
        deps["postgres"] = f"unavailable: {str(exc)[:40]}"

    # 2. Neo4j check
    try:
        async with driver.session() as session:
            result = await asyncio.wait_for(session.run("RETURN 1 AS num"), timeout=2.0)
            await result.single()
        deps["neo4j"] = "ok"
    except Exception as exc:
        deps["neo4j"] = f"unavailable: {str(exc)[:40]}"

    # 3. Redis check
    try:
        await asyncio.wait_for(redis.ping(), timeout=2.0)
        deps["redis"] = "ok"
    except Exception as exc:
        deps["redis"] = f"unavailable: {str(exc)[:40]}"

    # 4. Qdrant check
    try:
        async with httpx.AsyncClient(timeout=2.0) as http_client:
            resp = await http_client.get(f"{settings.qdrant_url}/healthz")
            deps["qdrant"] = "ok" if resp.status_code == 200 else f"status_{resp.status_code}"
    except Exception as exc:
        deps["qdrant"] = f"unavailable: {str(exc)[:40]}"

    has_errors = any("unavailable" in v for v in deps.values())
    status = "degraded" if has_errors else "ok"

    return HealthResponse(
        status=status,
        service=settings.app_name,
        environment=settings.environment,
        dependencies=deps,
        checked_at=datetime.now(UTC),
    )
