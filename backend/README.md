# Nexus Crime AI Backend

FastAPI backend foundation for the Nexus Crime AI investigation console.

## Run locally

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .
Copy-Item .env.example .env
uvicorn app.main:app --reload
```

Open `http://localhost:8000/docs`. The API runs in demo mode with deterministic data and does not require external services for read-only routes.

Demo login: `investigator@example.com` / `demo-password`.

## Seed databases

After PostgreSQL and Neo4j are available, initialize tables, the admin account, graph constraints, and the sample investigation graph:

```powershell
$env:PYTHONPATH = "."
python -m app.db.seed
```

Seeded administrator: `admin@system.local` / `AdminPass123!`.

The frontend lives in `../nexus-crime-ai-frontend` and uses `VITE_API_BASE_URL` from `.env` or `http://localhost:8000/api/v1` by default.

## Optional services

Set the connection values in `.env` for PostgreSQL, Neo4j, Redis, Qdrant, and an EVM RPC endpoint. The async clients, Celery worker, NetworkX analytics, and evidence hashing adapters are in `app/infrastructure/` and `app/worker.py`.

Run workers after Redis is available:

```powershell
celery -A app.worker.celery_app worker --loglevel=INFO
```

## Layout

- `app/api`: versioned routes, auth dependencies, and WebSocket handlers
- `app/schemas`: strict Pydantic v2 request/response contracts
- `app/core`: settings and JWT/bcrypt security helpers
- `app/infrastructure`: PostgreSQL, Neo4j, Redis, blockchain, and analytics seams
- `app/services`: deterministic demo repositories used until real stores are configured
- `app/worker.py`: Celery task entry point

See `../ADDITIONAL_APIS_AND_GAPS.md` for the endpoint inventory and required integration work.
