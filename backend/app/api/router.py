from fastapi import APIRouter

from app.api.routes import admin, alerts, assistant, auth, blockchain, cases, dashboard, health, ingestion, network, search, websocket

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(cases.router, prefix="/cases", tags=["cases"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
api_router.include_router(network.router, prefix="/network", tags=["network"])
api_router.include_router(blockchain.router, prefix="/blockchain", tags=["blockchain"])
api_router.include_router(assistant.router, prefix="/assistant", tags=["assistant"])
api_router.include_router(ingestion.router, prefix="/ingestion", tags=["ingestion"])
api_router.include_router(search.router, prefix="/search", tags=["search"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(websocket.router, tags=["realtime"])
