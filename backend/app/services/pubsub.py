import json
from collections import defaultdict

from redis.asyncio import Redis


class RealtimeBroadcaster:
    def __init__(self, redis: Redis) -> None:
        self.redis = redis
        self._channels: dict[str, set] = defaultdict(set)

    async def publish(self, channel: str, event: dict) -> int:
        return await self.redis.publish(channel, json.dumps(event, default=str))

    async def subscribe(self, channel: str):
        pubsub = self.redis.pubsub()
        await pubsub.subscribe(channel)
        return pubsub

    async def close_subscription(self, pubsub) -> None:
        await pubsub.close()
