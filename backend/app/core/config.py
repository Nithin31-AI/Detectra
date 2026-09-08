from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False, extra="ignore")

    app_name: str = "Nexus Crime AI API"
    environment: str = "development"
    debug: bool = False
    demo_mode: bool = True
    require_authentication: bool = False
    api_v1_prefix: str = "/api/v1"
    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:5173"])
    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    postgres_dsn: str = "postgresql+asyncpg://nexus:nexus@localhost:5432/nexus"
    neo4j_uri: str = "bolt://localhost:7687"
    neo4j_user: str = "neo4j"
    neo4j_password: str = "change-me"
    redis_url: str = "redis://localhost:6379/0"
    qdrant_url: str = "http://localhost:6333"
    qdrant_collection: str = "case_reports"
    qdrant_api_key: str | None = None
    web3_rpc_url: str | None = None
    evidence_anchor_contract_address: str | None = None
    evidence_contract_address: str | None = None
    evidence_anchor_contract_abi: str | None = None
    web3_chain_id: int = 1
    celery_broker_url: str = "redis://localhost:6379/1"
    celery_result_backend: str = "redis://localhost:6379/2"


@lru_cache
def get_settings() -> Settings:
    return Settings()
