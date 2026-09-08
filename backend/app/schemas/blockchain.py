from datetime import datetime

from pydantic import Field

from app.schemas.common import PageMeta, RiskLevel, StrictModel


class Transaction(StrictModel):
    id: str
    tx_hash: str
    chain_id: int
    from_address: str
    to_address: str
    amount: str
    asset: str
    status: str
    timestamp: datetime


class WalletAnalysis(StrictModel):
    address: str
    label: str | None
    risk: RiskLevel
    transaction_count: int = Field(ge=0)
    suspicious_count: int = Field(ge=0)
    connection_count: int = Field(ge=0)
    transactions: list[Transaction]


class EvidenceRecord(StrictModel):
    id: str
    case_id: str
    type: str
    sha256: str
    status: str
    block_number: int | None
    anchor_tx_hash: str | None


class EvidenceVerification(StrictModel):
    evidence_id: str
    verified: bool
    expected_sha256: str
    observed_sha256: str
    anchor_tx_hash: str | None
    message: str


class TransactionListResponse(StrictModel):
    items: list[Transaction]
    meta: PageMeta
