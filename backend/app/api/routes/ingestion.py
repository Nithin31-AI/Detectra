from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.api.deps import InvestigatorDep
from app.schemas.ingestion import IngestionResponse
from app.services.extraction_service import ReportExtractionService, ExtractedEntity

router = APIRouter()
extractor = ReportExtractionService()


@router.post("/reports", response_model=IngestionResponse, status_code=201)
async def ingest_report(_: InvestigatorDep, file: UploadFile = File(...)) -> IngestionResponse:
    if file.content_type not in {"application/pdf", "text/plain"}:
        raise HTTPException(status_code=415, detail="Only PDF and plain text reports are supported")
    content = await file.read()
    text = extractor.extract_pdf_text(content) if file.content_type == "application/pdf" else content.decode("utf-8", errors="replace")
    entities = extractor.extract_entities(text)
    return IngestionResponse(document_id=str(uuid4()), text_length=len(text), entities=[{"text": item.text, "label": item.label, "start": item.start, "end": item.end} for item in entities], normalized_entities=extractor.normalize_entities(entities))
