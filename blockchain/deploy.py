"""Deploy a local evidence contract through an Anvil/Ganache JSON-RPC endpoint."""

import json
import os
from pathlib import Path

from web3 import Web3

SOURCE = Path(__file__).with_name("EvidenceRegistry.sol")


def compile_contract() -> tuple[list[dict], str]:
    from solcx import compile_standard, install_solc

    version = "0.8.24"
    install_solc(version)
    result = compile_standard({"language": "Solidity", "sources": {SOURCE.name: {"content": SOURCE.read_text(encoding="utf-8")}}, "settings": {"outputSelection": {"*": {"*": ["abi", "evm.bytecode.object"]}}}}, solc_version=version)
    artifact = result["contracts"][SOURCE.name]["EvidenceRegistry"]
    return artifact["abi"], artifact["evm"]["bytecode"]["object"]


def deploy() -> None:
    rpc_url = os.getenv("WEB3_RPC_URL", "http://127.0.0.1:8545")
    private_key = os.environ.get("DEPLOYER_PRIVATE_KEY")
    if not private_key:
        raise RuntimeError("DEPLOYER_PRIVATE_KEY is required")
    web3 = Web3(Web3.HTTPProvider(rpc_url))
    if not web3.is_connected():
        raise RuntimeError(f"Cannot connect to local RPC at {rpc_url}")
    abi, bytecode = compile_contract()
    account = web3.eth.account.from_key(private_key)
    contract = web3.eth.contract(abi=abi, bytecode=bytecode)
    tx = contract.constructor().build_transaction({"from": account.address, "nonce": web3.eth.get_transaction_count(account.address), "gas": 2_000_000, "gasPrice": web3.eth.gas_price, "chainId": web3.eth.chain_id})
    signed = account.sign_transaction(tx)
    receipt = web3.eth.wait_for_transaction_receipt(web3.eth.send_raw_transaction(signed.raw_transaction))
    output = {"address": receipt.contractAddress, "abi": abi, "rpc_url": rpc_url, "chain_id": web3.eth.chain_id}
    Path("blockchain/deployment.json").write_text(json.dumps(output, indent=2), encoding="utf-8")
    Path("blockchain/EvidenceRegistry.abi.json").write_text(json.dumps(abi, indent=2), encoding="utf-8")
    update_backend_env(output)
    update_backend_contract_module(abi)
    print(json.dumps(output, indent=2))


def update_backend_env(deployment: dict) -> None:
    env_path = Path("backend/.env")
    lines = env_path.read_text(encoding="utf-8").splitlines() if env_path.exists() else []
    values = {"WEB3_RPC_URL": deployment["rpc_url"], "WEB3_CHAIN_ID": str(deployment["chain_id"]), "EVIDENCE_CONTRACT_ADDRESS": deployment["address"], "EVIDENCE_ANCHOR_CONTRACT_ADDRESS": deployment["address"]}
    for key, value in values.items():
        replacement = f"{key}={value}"
        for index, line in enumerate(lines):
            if line.startswith(f"{key}="):
                lines[index] = replacement
                break
        else:
            lines.append(replacement)
    env_path.parent.mkdir(parents=True, exist_ok=True)
    env_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def update_backend_contract_module(abi: list[dict]) -> None:
    module_path = Path("backend/app/core/contracts.py")
    source = module_path.read_text(encoding="utf-8")
    start = source.index("EVIDENCE_CONTRACT_ABI")
    end = source.index("\n\n\nclass ContractSettings", start)
    generated = f"EVIDENCE_CONTRACT_ABI: list[dict[str, Any]] = {abi!r}"
    module_path.write_text(source[:start] + generated + source[end:], encoding="utf-8")


if __name__ == "__main__":
    deploy()
