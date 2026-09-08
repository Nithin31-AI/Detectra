from fastapi import APIRouter, HTTPException, Query

from app.api.deps import CurrentUserDep
from app.schemas.blockchain import EvidenceVerification, TransactionListResponse, WalletAnalysis
from app.schemas.common import PageMeta, RiskLevel
from app.services import mock_data

router = APIRouter()


@router.get("/wallets/{address}", response_model=WalletAnalysis)
async def analyze_wallet(address: str, _: CurrentUserDep) -> WalletAnalysis:
    items = [tx for tx in mock_data.TRANSACTIONS if address.lower() in f"{tx.from_address} {tx.to_address}".lower()]
    suspicious = sum(item.status == "Suspicious" for item in items)
    return WalletAnalysis(address=address, label=None, risk=RiskLevel.high, transaction_count=len(items), suspicious_count=suspicious, connection_count=len({tx.to_address for tx in items}), transactions=items)


@router.get("/wallets/{address}/transactions", response_model=TransactionListResponse)
async def wallet_transactions(address: str, _: CurrentUserDep, page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100)) -> TransactionListResponse:
    items = [tx for tx in mock_data.TRANSACTIONS if address.lower() in f"{tx.from_address} {tx.to_address}".lower()]
    start = (page - 1) * page_size
    return TransactionListResponse(items=items[start:start + page_size], meta=PageMeta(page=page, page_size=page_size, total=len(items)))


@router.get("/evidence/{evidence_id}/verify", response_model=EvidenceVerification)
async def verify_evidence(evidence_id: str, _: CurrentUserDep) -> EvidenceVerification:
    evidence = next((item for item in mock_data.EVIDENCE if item.id == evidence_id), None)
    if evidence is None:
        raise HTTPException(status_code=404, detail="Evidence not found")
    verified = evidence.status == "Verified"
    return EvidenceVerification(evidence_id=evidence.id, verified=verified, expected_sha256=evidence.sha256, observed_sha256=evidence.sha256 if verified else "mismatch", anchor_tx_hash=evidence.anchor_tx_hash, message="Evidence hash matches the blockchain anchor." if verified else "Evidence hash does not match the blockchain anchor.")
