import asyncio

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.infrastructure.redis_client import redis
from app.services.websocket_manager import WebSocketManager
router = APIRouter()
manager = WebSocketManager(redis)


@router.websocket("/ws/{channel}")
async def websocket_updates(websocket: WebSocket, channel: str) -> None:
    await manager.connect(channel, websocket)
    listener = asyncio.create_task(manager.subscribe(channel))
    await websocket.send_json({"type": "connected", "channel": channel})
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        await manager.disconnect(channel, websocket)
        listener.cancel()
