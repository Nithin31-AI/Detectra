# Nexus Crime AI: API Inventory and Gaps

## Findings from the current checkout

- The repository contains only `nexus-crime-ai-frontend/`; no blockchain directory, Solidity source, ABI, deployed contract address, or chain configuration was present.
- The React pages use hard-coded arrays and local state. There are no `fetch`/Axios calls, WebSocket subscriptions, authentication headers, or token storage yet.
- The frontend route/state contract uses labels such as `CASE-001`, `Person A`, and `Wallet A`. The backend uses stable IDs and returns structured data so these labels can be replaced incrementally.
- Backend risk enum values are uppercase (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`). The UI can map these to its title-case display labels.

## Frontend-facing API surface

All REST routes are under `/api/v1` and accept an optional Bearer token in the current demo mode. Once authentication is enforced, obtain a token from `/api/v1/auth/token`.

| Method | Path | Purpose | Response |
| --- | --- | --- | --- |
| GET | `/health` | Liveness and dependency status | `HealthResponse` |
| POST | `/auth/token` | OAuth2-compatible JWT login | `TokenResponse` |
| GET | `/auth/me` | Current investigator | `CurrentUser` |
| GET | `/dashboard` | KPI cards, recent alerts, risk distribution | `DashboardResponse` |
| GET | `/cases` | Search/filter/paginate investigations | `CaseListResponse` |
| GET | `/cases/{case_id}` | Case detail, suspects, wallets, evidence, findings | `CaseDetail` |
| POST | `/cases` | Create a case through the case service | `CaseDetail` |
| PATCH | `/cases/{case_id}` | Update a case through the case service | `CaseDetail` |
| GET | `/alerts` | Search/filter/paginate alerts and counts | `AlertListResponse` |
| PATCH | `/alerts/{alert_id}` | Change alert status | `{id, status}` |
| GET | `/network/graph` | Cytoscape-compatible nodes and edges | `NetworkGraphResponse` |
| GET | `/network/entities` | Entity search and filtering | `EntitySearchResponse` |
| GET | `/network/metrics` | Degree, betweenness, eigenvector, communities | `NetworkMetrics` |
| GET | `/blockchain/wallets/{address}` | Wallet risk and transaction analysis | `WalletAnalysis` |
| GET | `/blockchain/wallets/{address}/transactions` | Paginated wallet transactions | `TransactionListResponse` |
| GET | `/blockchain/evidence/{evidence_id}/verify` | Compare evidence hash with anchor | `EvidenceVerification` |
| POST | `/assistant/query` | RAG/copilot query contract | `AssistantResponse` |
| POST | `/ingestion/reports` | Upload PDF/text and run spaCy entity extraction | `IngestionResponse` |
| POST | `/search/semantic` | Search report vectors in Qdrant | `SemanticSearchResponse` |
| POST | `/admin/graph/reindex` | Queue graph re-indexing in Celery | `{job_id, status}` |
| POST | `/admin/evidence/{evidence_id}/process` | Queue evidence processing in Celery | `{job_id, status}` |
| POST | `/admin/broadcast/{channel}` | Publish a real-time event through Redis | `{subscribers}` |
| WS | `/ws/{channel}` | Live alerts, graph, or digital-twin events | JSON event envelope |

### Query parameters

- `/cases`: `status`, `search`, `page`, `page_size`
- `/alerts`: `severity`, `status`, `search`, `page`, `page_size`
- `/network/graph`: `case_id`, `entity_id`, `depth`
- `/network/entities`: `search`, `type`, `page`, `page_size`
- `/network/metrics`: `case_id`
- Wallet transaction routes: `page`, `page_size`

## Pydantic schemas

Schemas are in `backend/app/schemas/` and reject unknown fields (`extra="forbid"`) with strict validation.

- `DashboardResponse`: `kpis`, `recent_alerts`, `risk_distribution`, `generated_at`.
- `CaseSummary`: `id`, `title`, `description`, `status`, `priority`, `suspects`, `entities`, `wallets`, `updated_at`.
- `CaseDetail`: `CaseSummary` plus `risk_score`, `suspects_detail`, `wallets_detail`, `evidence`, `findings`.
- `Alert`: `id`, `title`, `description`, `severity`, `status`, `entity`, `created_at`, `risk_score`, `recommendation`.
- `Entity`: `id`, `label`, `type`, `risk`, `connections`, `cases`.
- `NetworkGraphResponse`: `nodes`, `edges`, `meta`; each edge has `source`, `target`, `relationship`, and `weight`.
- `WalletAnalysis`: `address`, `label`, `risk`, transaction counts, connection count, and `transactions`.
- `EvidenceVerification`: `evidence_id`, `verified`, expected/observed SHA-256, anchor transaction, and message.
- `AssistantQuery`: `question`, optional `entity`, `case_id`, and `conversation_id`.
- `IngestionResponse`: extracted entities with offsets and normalized entity buckets.
- `SemanticSearchRequest`: a vector and result limit; `SemanticSearchResponse` returns Qdrant payloads and scores.
- `RiskExplanationResponse`: normalized score, base value, and SHAP feature contributions.

## Remaining recommended APIs

These remain future additions because they require a persistence contract beyond the current frontend:

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/ingestion/jobs/{job_id}` | Track Celery extraction and embedding status |
| POST | `/ai/risk/{entity_id}` | Run GNN risk score with SHAP contributions |
| GET | `/ai/risk/{entity_id}/explanation` | Retrieve explainability features |
| GET | `/audit` | Filter immutable audit events |
| POST | `/blockchain/sync` | Queue EVM log synchronization by chain/block range |
| POST | `/evidence` | Store evidence metadata and optional on-chain anchor |
| GET | `/ws/{channel}` | Keep as the real-time channel contract; publish through Redis pub/sub in production |

## Integration gaps and next actions

1. Provide the blockchain repository or ABI/deployed address. Without it, event decoding and contract anchor lookup cannot be enabled.
2. Replace the deterministic seed repository with PostgreSQL-backed case, alert, and wallet repositories for production persistence.
3. Add Alembic migrations and tenant-scoped authorization before deployment.
4. Configure LangChain credentials and a Neo4j graph to enable the RAG provider; configure a spaCy model such as `en_core_web_sm` for ingestion.
5. Add the frontend Axios client and WebSocket hook. The current frontend will continue showing local arrays until it calls these routes.
6. Configure Redis, Qdrant, Celery, and an EVM RPC endpoint in `.env` before using their provider-backed routes.
7. Replace the demo password flow, set `REQUIRE_AUTHENTICATION=true`, and rotate `JWT_SECRET_KEY` in deployment.
