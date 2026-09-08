import asyncio
from datetime import UTC, datetime

from sqlalchemy import select

from app.core.security import hash_password
from app.db.models import Base, CaseModel, UserModel
from app.infrastructure.database import AsyncSessionFactory, engine
from app.infrastructure.neo4j_client import driver

ADMIN_USERNAME = "admin@system.local"
ADMIN_PASSWORD = "AdminPass123!"
INVESTIGATOR_USERNAME = "investigator@example.com"
INVESTIGATOR_PASSWORD = "demo-password"


async def init_postgres() -> None:
    print("PostgreSQL: Initializing tables and demo accounts...")
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    async with AsyncSessionFactory() as session:
        admin = await session.scalar(select(UserModel).where(UserModel.username == ADMIN_USERNAME))
        if admin is None:
            admin = UserModel(username=ADMIN_USERNAME, password_hash=hash_password(ADMIN_PASSWORD), role="admin", is_active=True)
            session.add(admin)
            await session.flush()

        investigator = await session.scalar(select(UserModel).where(UserModel.username == INVESTIGATOR_USERNAME))
        if investigator is None:
            investigator = UserModel(username=INVESTIGATOR_USERNAME, password_hash=hash_password(INVESTIGATOR_PASSWORD), role="investigator", is_active=True)
            session.add(investigator)
            await session.flush()

        case1 = await session.scalar(select(CaseModel).where(CaseModel.id == "CASE-001"))
        if case1 is None:
            session.add(CaseModel(
                id="CASE-001",
                title="Operation Dark Web",
                description="Investigation into a suspected criminal network involving high-risk entities, wallets and devices.",
                status="Active",
                priority="CRITICAL",
                risk_score=92,
                created_by=admin.id,
                updated_at=datetime.now(UTC),
                metadata_json={"seeded": True, "suspects_count": 4, "wallets_count": 7}
            ))

        case2 = await session.scalar(select(CaseModel).where(CaseModel.id == "CASE-002"))
        if case2 is None:
            session.add(CaseModel(
                id="CASE-002",
                title="Crypto Laundering Network",
                description="Suspicious cryptocurrency transfers detected across interconnected wallets.",
                status="Investigating",
                priority="HIGH",
                risk_score=87,
                created_by=admin.id,
                updated_at=datetime.now(UTC),
                metadata_json={"seeded": True, "suspects_count": 3, "wallets_count": 9}
            ))
        await session.commit()
    print("PostgreSQL: Seeding complete.")


async def init_neo4j() -> None:
    print("Neo4j: Initializing constraints and graph entities...")
    constraints = [
        "CREATE CONSTRAINT entity_id_unique IF NOT EXISTS FOR (node:Entity) REQUIRE node.id IS UNIQUE",
        "CREATE CONSTRAINT person_id_unique IF NOT EXISTS FOR (node:Person) REQUIRE node.id IS UNIQUE",
        "CREATE CONSTRAINT phone_number_unique IF NOT EXISTS FOR (node:Phone) REQUIRE node.number IS UNIQUE",
        "CREATE CONSTRAINT wallet_address_unique IF NOT EXISTS FOR (node:Wallet) REQUIRE node.address IS UNIQUE",
        "CREATE CONSTRAINT ip_address_unique IF NOT EXISTS FOR (node:IP) REQUIRE node.address IS UNIQUE",
    ]
    async with driver.session() as session:
        for query in constraints:
            await session.run(query)

        seed_query = """
        MERGE (a:Person:Entity {id: 'person1'})
          SET a.label='Person A', a.type='Person', a.risk='HIGH', a.cases=3, a.case_ids=['CASE-001']
        MERGE (p2:Person:Entity {id: 'person2'})
          SET p2.label='Person B', p2.type='Person', p2.risk='MEDIUM', p2.cases=2, p2.case_ids=['CASE-001', 'CASE-002']
        MERGE (b:Wallet:Entity {id: 'wallet1'})
          SET b.label='Wallet A', b.address='wallet1', b.type='Wallet', b.risk='HIGH', b.cases=2, b.case_ids=['CASE-001']
        MERGE (w2:Wallet:Entity {id: 'wallet2'})
          SET w2.label='Wallet B', w2.address='wallet2', w2.type='Wallet', w2.risk='MEDIUM', w2.cases=1, w2.case_ids=['CASE-002']
        MERGE (d:IP:Entity {id: 'ip1'})
          SET d.label='Seed IP', d.address='192.0.2.10', d.type='IP', d.risk='LOW', d.cases=1, d.case_ids=['CASE-001']
        MERGE (a)-[:CONTROLS {weight: 1.0}]->(b)
        MERGE (a)-[:USES {weight: 1.0}]->(d)
        MERGE (a)-[:ASSOCIATES_WITH {weight: 1.0}]->(p2)
        MERGE (p2)-[:USES {weight: 1.0}]->(w2)
        """
        await session.run(seed_query)
    print("Neo4j: Graph seeding complete.")


async def init_qdrant() -> None:
    print("Qdrant: Initializing collection and vector embeddings...")
    from app.infrastructure.qdrant_client import QdrantVectorStore

    store = QdrantVectorStore()
    try:
        await store.ensure_collection(vector_size=3, distance="Cosine")
        points = [
            {
                "id": 1,
                "vector": [0.85, 0.12, 0.33],
                "payload": {
                    "case_id": "CASE-001",
                    "title": "Operation Dark Web",
                    "summary": "Investigation into dark web narcotics network and illicit wallet transactions.",
                    "risk_level": "CRITICAL"
                }
            },
            {
                "id": 2,
                "vector": [0.15, 0.92, 0.44],
                "payload": {
                    "case_id": "CASE-002",
                    "title": "Crypto Laundering Network",
                    "summary": "Cross-border cryptocurrency laundering syndicate involving multi-sig wallets.",
                    "risk_level": "HIGH"
                }
            },
            {
                "id": 3,
                "vector": [0.0, 0.0, 0.0],
                "payload": {
                    "case_id": "CASE-003",
                    "title": "Baseline Reference Report",
                    "summary": "Baseline reference vector report for automated semantic indexing checks.",
                    "risk_level": "LOW"
                }
            }
        ]
        await store.upsert(points)
        print("Qdrant: Vector points seeded successfully.")
    except Exception as exc:
        print(f"Qdrant seeding note: {exc}")
    finally:
        await store.close()


async def init_redis() -> None:
    print("Redis: Checking connection and setting seed state...")
    from app.infrastructure.redis_client import redis, close_redis

    try:
        await redis.ping()
        await redis.set("system:last_seed", datetime.now(UTC).isoformat())
        print("Redis: Ready and verified.")
    except Exception as exc:
        print(f"Redis seeding note: {exc}")
    finally:
        await close_redis()


async def seed() -> None:
    print("--- Starting Seed Sequence ---")
    await init_postgres()
    await init_neo4j()
    await init_qdrant()
    await init_redis()
    await driver.close()
    await engine.dispose()
    print("--- Seeding Finished Successfully ---")


if __name__ == "__main__":
    asyncio.run(seed())
