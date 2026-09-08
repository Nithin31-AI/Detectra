from datetime import UTC, datetime, timedelta

from app.schemas.alerts import Alert
from app.schemas.blockchain import EvidenceRecord, Transaction
from app.schemas.cases import CaseDetail, CaseEvidence, CaseSummary, Suspect
from app.schemas.common import AlertStatus, CaseStatus, EntityType, RiskLevel
from app.schemas.dashboard import DashboardAlert, DashboardKpis, DashboardResponse
from app.schemas.network import Edge, Entity, NetworkGraphResponse, NetworkMetrics

NOW = datetime.now(UTC)

CASES = [
    CaseDetail(
        id="CASE-001", title="Operation Dark Web", description="Investigation into a suspected criminal network involving high-risk entities, wallets and devices.", status=CaseStatus.active, priority=RiskLevel.critical, suspects=4, entities=18, wallets=7, updated_at=NOW - timedelta(minutes=10), risk_score=92,
        suspects_detail=[Suspect(name="Person A", role="Primary Suspect", risk=RiskLevel.critical), Suspect(name="Person B", role="Associate", risk=RiskLevel.high)], wallets_detail=[{"name": "Wallet A", "risk": "HIGH", "activity": "247 transactions"}], evidence=[CaseEvidence(title="Suspicious cryptocurrency transactions", type="Blockchain", status="Verified")], findings=["Network appears centered around Person A.", "Wallet A shows a high-risk transaction pattern."],
    ),
    CaseDetail(
        id="CASE-002", title="Crypto Laundering Network", description="Suspicious cryptocurrency transfers detected across interconnected wallets.", status=CaseStatus.investigating, priority=RiskLevel.high, suspects=3, entities=12, wallets=9, updated_at=NOW - timedelta(minutes=32), risk_score=87,
        suspects_detail=[Suspect(name="Person E", role="Financial Associate", risk=RiskLevel.high)], wallets_detail=[{"name": "Wallet D", "risk": "HIGH", "activity": "134 transactions"}], evidence=[CaseEvidence(title="High-value crypto transfers", type="Blockchain", status="Verified")], findings=["Funds appear to move through intermediary wallets."],
    ),
]

ALERTS = [
    Alert(id="ALT-001", title="High-Risk Wallet Activity", description="Multiple suspicious transactions detected from Wallet A.", severity=RiskLevel.critical, status=AlertStatus.new, entity="Wallet A", created_at=NOW - timedelta(minutes=5), risk_score=96, recommendation="Trace Wallet A transaction flow and identify connected entities."),
    Alert(id="ALT-002", title="Criminal Network Expansion", description="Person A has established new connections with high-risk entities.", severity=RiskLevel.high, status=AlertStatus.investigating, entity="Person A", created_at=NOW - timedelta(minutes=18), risk_score=92, recommendation="Analyze Person A's network and newly connected entities."),
    Alert(id="ALT-003", title="Suspicious Transaction Pattern", description="Unusual transaction flow detected between connected wallets.", severity=RiskLevel.high, status=AlertStatus.new, entity="Wallet B", created_at=NOW - timedelta(minutes=32), risk_score=87, recommendation="Investigate Wallet B and compare transaction relationships."),
]

ENTITIES = [
    Entity(id="person1", label="Person A", type=EntityType.person, risk=RiskLevel.high, connections=5, cases=3),
    Entity(id="person2", label="Person B", type=EntityType.person, risk=RiskLevel.medium, connections=3, cases=2),
    Entity(id="wallet1", label="Wallet A", type=EntityType.wallet, risk=RiskLevel.high, connections=4, cases=2),
    Entity(id="wallet2", label="Wallet B", type=EntityType.wallet, risk=RiskLevel.medium, connections=2, cases=1),
    Entity(id="device1", label="Device A", type=EntityType.device, risk=RiskLevel.low, connections=2, cases=1),
]
EDGES = [Edge(id="e1", source="person1", target="wallet1", relationship="controls", weight=1), Edge(id="e2", source="person1", target="person2", relationship="associates_with", weight=1), Edge(id="e3", source="person2", target="wallet2", relationship="uses", weight=1), Edge(id="e4", source="person1", target="device1", relationship="accesses", weight=1)]

TRANSACTIONS = [
    Transaction(id="TXN-001", tx_hash="0x001", chain_id=1, from_address="Wallet A", to_address="Wallet B", amount="2.45", asset="ETH", status="Normal", timestamp=NOW - timedelta(minutes=10)),
    Transaction(id="TXN-002", tx_hash="0x002", chain_id=1, from_address="Wallet A", to_address="Wallet C", amount="18.90", asset="ETH", status="Suspicious", timestamp=NOW - timedelta(minutes=24)),
    Transaction(id="TXN-003", tx_hash="0x003", chain_id=1, from_address="Wallet B", to_address="Wallet D", amount="7.20", asset="ETH", status="Normal", timestamp=NOW - timedelta(minutes=41)),
]
EVIDENCE = [EvidenceRecord(id="EVD-001", case_id="CASE-001", type="Transaction Record", sha256="a83f91cd72e8b4f1", status="Verified", block_number=1847291, anchor_tx_hash="0xanchor001"), EvidenceRecord(id="EVD-003", case_id="CASE-002", type="Investigation Report", sha256="91bc772a4d8e23c1", status="Tampered", block_number=1847312, anchor_tx_hash="0xanchor003")]


def dashboard() -> DashboardResponse:
    return DashboardResponse(kpis=DashboardKpis(active_cases=24, entities_analyzed=148, active_alerts=8, wallets_analyzed=37), recent_alerts=[DashboardAlert(title=a.title, entity=a.entity, severity=a.severity.value, created_at=a.created_at) for a in ALERTS], risk_distribution={"CRITICAL": 8, "HIGH": 24, "MEDIUM": 47, "LOW": 69}, generated_at=datetime.now(UTC))


def graph() -> NetworkGraphResponse:
    return NetworkGraphResponse(nodes=ENTITIES, edges=EDGES, meta={"page": 1, "page_size": 100, "total": len(ENTITIES)})


def metrics() -> NetworkMetrics:
    return NetworkMetrics(degree={"person1": 3, "person2": 2, "wallet1": 1, "wallet2": 1, "device1": 1}, betweenness={"person1": 0.67, "person2": 0.17}, eigenvector={"person1": 0.81, "person2": 0.42}, communities=[["person1", "wallet1", "device1"], ["person2", "wallet2"]])
