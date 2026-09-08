from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import get_settings
from app.infrastructure.database import close_database, init_database
from app.infrastructure.neo4j_client import close_neo4j
from app.infrastructure.redis_client import close_redis

logger = logging.getLogger("nexus.main")


@asynccontextmanager
async def lifespan(_: FastAPI):
    try:
        await init_database()
        logger.info("Database schema initialized.")
    except Exception as exc:
        logger.warning("Database schema check warning: %s", exc)

    yield

    try:
        await close_redis()
    except Exception:
        pass
    try:
        await close_neo4j()
    except Exception:
        pass
    try:
        await close_database()
    except Exception:
        pass


settings = get_settings()
app = FastAPI(title=settings.app_name, version="0.1.0", debug=settings.debug, lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/", tags=["health"])
async def root() -> dict[str, str]:
    return {"service": settings.app_name, "docs": "/docs"}
