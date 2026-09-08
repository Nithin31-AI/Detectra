from collections.abc import Sequence

from app.core.config import get_settings


class QdrantVectorStore:
    def __init__(self) -> None:
        from qdrant_client import AsyncQdrantClient

        settings = get_settings()
        self.client = AsyncQdrantClient(url=settings.qdrant_url, api_key=settings.qdrant_api_key)
        self.collection = settings.qdrant_collection

    async def ensure_collection(self, vector_size: int, distance: str = "Cosine") -> None:
        from qdrant_client.models import Distance, VectorParams

        configured_distance = getattr(Distance, distance.upper(), getattr(Distance, distance, Distance.COSINE))
        exists = await self.client.collection_exists(self.collection)
        if not exists:
            await self.client.create_collection(
                self.collection,
                vectors_config=VectorParams(size=vector_size, distance=configured_distance)
            )

    async def search(self, vector: Sequence[float], limit: int = 5) -> list[dict]:
        if hasattr(self.client, "query_points"):
            response = await self.client.query_points(collection_name=self.collection, query=list(vector), limit=limit)
            items = response.points
        else:
            items = await self.client.search(collection_name=self.collection, query_vector=list(vector), limit=limit)
        return [{"id": str(item.id), "score": item.score, "payload": item.payload or {}} for item in items]

    async def upsert(self, points: list[dict]) -> None:
        from qdrant_client.models import PointStruct

        await self.client.upsert(
            self.collection,
            points=[PointStruct(id=point["id"], vector=point["vector"], payload=point.get("payload", {})) for point in points]
        )

    async def close(self) -> None:
        await self.client.close()
