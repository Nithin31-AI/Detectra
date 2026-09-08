import json
import os
from typing import Any

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


EVIDENCE_CONTRACT_ABI: list[dict[str, Any]] = [
    {
        "type": "function",
        "name": "anchorEvidence",
        "stateMutability": "nonpayable",
        "inputs": [{"name": "evidenceHash", "type": "bytes32"}, {"name": "evidenceId", "type": "string"}],
        "outputs": [],
    },
    {
        "type": "function",
        "name": "verifyEvidence",
        "stateMutability": "view",
        "inputs": [{"name": "evidenceHash", "type": "bytes32"}],
        "outputs": [{"name": "valid", "type": "bool"}],
    },
    {
        "type": "function",
        "name": "getEvidence",
        "stateMutability": "view",
        "inputs": [{"name": "evidenceHash", "type": "bytes32"}],
        "outputs": [
            {"name": "evidenceHash", "type": "bytes32"},
            {"name": "timestamp", "type": "uint256"},
            {"name": "submitter", "type": "address"},
        ],
    },
    {
        "type": "event",
        "name": "EvidenceAnchored",
        "anonymous": False,
        "inputs": [
            {"indexed": True, "name": "evidenceHash", "type": "bytes32"},
            {"indexed": False, "name": "evidenceId", "type": "string"},
            {"indexed": True, "name": "submitter", "type": "address"},
        ],
    },
]


class ContractSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    rpc_url: str | None = Field(default=None, validation_alias="WEB3_RPC_URL")
    address: str | None = Field(default=None, validation_alias="EVIDENCE_CONTRACT_ADDRESS")
    abi_json: str | None = Field(default=None, validation_alias="EVIDENCE_CONTRACT_ABI")

    @property
    def abi(self) -> list[dict[str, Any]]:
        return json.loads(self.abi_json) if self.abi_json else EVIDENCE_CONTRACT_ABI


contracts = ContractSettings()


def contract_address() -> str | None:
    return os.getenv("EVIDENCE_CONTRACT_ADDRESS", contracts.address)
