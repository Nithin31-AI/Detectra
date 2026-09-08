from celery import Celery

from app.core.config import get_settings

settings = get_settings()
celery_app = Celery("nexus-crime-ai", broker=settings.celery_broker_url, backend=settings.celery_result_backend)
celery_app.conf.task_routes = {"app.worker.process_evidence": {"queue": "evidence"}, "app.worker.reindex_graph": {"queue": "graph"}}


@celery_app.task(name="app.worker.process_evidence")
def process_evidence(evidence_id: str) -> dict[str, str]:
    return {"evidence_id": evidence_id, "status": "queued_for_processing"}


@celery_app.task(name="app.worker.reindex_graph")
def reindex_graph() -> dict[str, str]:
    return {"status": "queued_for_reindex"}
