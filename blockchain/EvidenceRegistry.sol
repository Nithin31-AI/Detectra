// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EvidenceRegistry {
    struct Evidence {
        uint256 timestamp;
        address submitter;
        string evidenceId;
        bool exists;
    }

    mapping(bytes32 => Evidence) private evidence;
    event EvidenceAnchored(bytes32 indexed evidenceHash, string evidenceId, address indexed submitter);

    function anchorEvidence(bytes32 evidenceHash, string calldata evidenceId) external {
        require(!evidence[evidenceHash].exists, "Evidence already anchored");
        evidence[evidenceHash] = Evidence(block.timestamp, msg.sender, evidenceId, true);
        emit EvidenceAnchored(evidenceHash, evidenceId, msg.sender);
    }

    function verifyEvidence(bytes32 evidenceHash) external view returns (bool) {
        return evidence[evidenceHash].exists;
    }

    function getEvidence(bytes32 evidenceHash) external view returns (bytes32, uint256, address) {
        Evidence memory item = evidence[evidenceHash];
        require(item.exists, "Evidence not found");
        return (evidenceHash, item.timestamp, item.submitter);
    }
}
