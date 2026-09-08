from hashlib import sha256


def evidence_sha256(content: bytes) -> str:
    return sha256(content).hexdigest()


class BlockchainVerifier:
    """Web3 adapter seam; RPC and ABI calls belong here once contract artifacts are supplied."""

    async def verify_anchor(self, evidence_hash: str, transaction_hash: str | None) -> bool:
        return bool(evidence_hash and transaction_hash)
