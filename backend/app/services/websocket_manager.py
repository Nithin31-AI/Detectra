import asyncio
import json
from collections import defaultdict

from fastapi import WebSocket
from redis.asyncio import Redis


class WebSocketManager:
    def __init__(self, redis: Redis) -> None:
        self.redis = redis
        self.connections: dict[str, set[WebSocket]] = defaultdict(set)

    async def connect(self, channel: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self.connections[channel].add(websocket)

    async def disconnect(self, channel: str, websocket: WebSocket) -> None:
        self.connections[channel].discard(websocket)
        if not self.connections[channel]:
            self.connections.pop(channel, None)

    async def broadcast(self, channel: str, event: dict) -> None:
        payload = json.dumps(event, default=str)
        disconnected: list[WebSocket] = []
        for websocket in self.connections.get(channel, set()):
            try:
                await websocket.send_text(payload)
            except Exception:
                disconnected.append(websocket)
        for websocket in disconnected:
            await self.disconnect(channel, websocket)

    async def subscribe(self, channel: str) -> None:
        pubsub = self.redis.pubsub()
        await pubsub.subscribe(channel)
        try:
            async for message in pubsub.listen():
                if message["type"] == "message":
                    await self.broadcast(channel, json.loads(message["data"]))
        finally:
            await pubsub.unsubscribe(channel)
            await pubsub.close()
