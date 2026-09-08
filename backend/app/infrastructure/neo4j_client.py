from collections.abc import AsyncIterator

from neo4j import AsyncDriver, AsyncGraphDatabase

from app.core.config import get_settings

settings = get_settings()
driver: AsyncDriver = AsyncGraphDatabase.driver(settings.neo4j_uri, auth=(settings.neo4j_user, settings.neo4j_password))


async def get_neo4j_driver() -> AsyncIterator[AsyncDriver]:
    yield driver


async def close_neo4j() -> None:
    await driver.close()
