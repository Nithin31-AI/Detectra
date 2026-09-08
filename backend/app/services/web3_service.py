import asyncio
import json
from collections.abc import AsyncIterator
from dataclasses import dataclass

from app.core.config import get_settings
from app.core.contracts import EVIDENCE_CONTRACT_ABI
from app.infrastructure.blockchain import evidence_sha256


@dataclass(frozen=True, slots=True)
class ChainTransaction:
    transaction_hash: str
    block_number: int
    from_address: str
    to_address: str
    value_wei: int


class Web3VerificationService:
    def __init__(self) -> None:
        from web3 import AsyncWeb3
        from web3.providers import AsyncHTTPProvider

        settings = get_settings()
        if not settings.web3_rpc_url:
            raise RuntimeError("WEB3_RPC_URL is required for blockchain operations")
        self.web3 = AsyncWeb3(AsyncHTTPProvider(settings.web3_rpc_url))
        self.chain_id = settings.web3_chain_id
        self.contract = self.web3.eth.contract(address=settings.evidence_contract_address, abi=EVIDENCE_CONTRACT_ABI) if settings.evidence_contract_address else None

    async def anchor_evidence(self, metadata: dict, evidence_id: str, private_key: str) -> str:
        if self.contract is None:
            raise RuntimeError("EVIDENCE_CONTRACT_ADDRESS is required for anchoring")
        account = self.web3.eth.account.from_key(private_key)
        evidence_hash = evidence_sha256(json.dumps(metadata, sort_keys=True, separators=(",", ":")).encode())
        digest = bytes.fromhex(evidence_hash)
        nonce = await self.web3.eth.get_transaction_count(account.address)
        transaction = await self.contract.functions.anchorEvidence(digest, evidence_id).build_transaction({"from": account.address, "nonce": nonce, "chainId": self.chain_id, "gas": 250_000, "gasPrice": await self.web3.eth.gas_price})
        signed = account.sign_transaction(transaction)
        return (await self.web3.eth.send_raw_transaction(signed.raw_transaction)).hex()

    async def transaction(self, transaction_hash: str) -> ChainTransaction:
        tx = await self.web3.eth.get_transaction(transaction_hash)
        return ChainTransaction(transaction_hash=transaction_hash, block_number=int(tx.get("blockNumber", 0)), from_address=tx["from"], to_address=tx.get("to", ""), value_wei=int(tx["value"]))

    async def logs(self, address: str, from_block: int, to_block: int | str = "latest") -> list[dict]:
        return [dict(log) for log in await self.web3.eth.get_logs({"address": address, "fromBlock": from_block, "toBlock": to_block})]

    async def validate_evidence(self, metadata: dict, expected_hash: str) -> bool:
        calculated_hash = evidence_sha256(json.dumps(metadata, sort_keys=True, separators=(",", ":")).encode())
        if calculated_hash != expected_hash:
            return False
        if self.contract is None:
            return True
        evidence_bytes = bytes.fromhex(expected_hash.removeprefix("0x"))
        return bool(await self.contract.functions.verifyEvidence(evidence_bytes).call())

    async def evidence_logs(self, from_block: int, to_block: int | str = "latest") -> list[dict]:
        if self.contract is None:
            return []
        event = self.contract.events.EvidenceAnchored()
        return [dict(log) for log in await event.get_logs(from_block=from_block, to_block=to_block)]

    async def follow_wallet(self, address: str, from_block: int, to_block: int | str = "latest") -> AsyncIterator[ChainTransaction]:
        latest = await self.web3.eth.block_number if to_block == "latest" else int(to_block)
        for block_number in range(from_block, latest + 1):
            block = await self.web3.eth.get_block(block_number, full_transactions=True)
            for tx in block.transactions:
                if tx["from"].lower() == address.lower() or (tx.get("to") and tx["to"].lower() == address.lower()):
                    yield ChainTransaction(tx["hash"].hex(), block_number, tx["from"], tx.get("to", ""), int(tx["value"]))
