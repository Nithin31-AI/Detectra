import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Search,
  Wallet,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Activity,
  Link2,
  FileCheck,
  Database,
  CheckCircle2,
  XCircle,
} from "lucide-react";

type Transaction = {
  id: string;
  from: string;
  to: string;
  amount: string;
  status: "Normal" | "Suspicious";
  time: string;
};

type Evidence = {
  id: string;
  caseId: string;
  type: string;
  hash: string;
  status: "Verified" | "Tampered";
  block: string;
};

const transactions: Transaction[] = [
  {
    id: "TXN-001",
    from: "Wallet A",
    to: "Wallet B",
    amount: "2.45 ETH",
    status: "Normal",
    time: "10 min ago",
  },
  {
    id: "TXN-002",
    from: "Wallet A",
    to: "Wallet C",
    amount: "18.90 ETH",
    status: "Suspicious",
    time: "24 min ago",
  },
  {
    id: "TXN-003",
    from: "Wallet B",
    to: "Wallet D",
    amount: "7.20 ETH",
    status: "Normal",
    time: "41 min ago",
  },
  {
    id: "TXN-004",
    from: "Wallet C",
    to: "Wallet E",
    amount: "31.75 ETH",
    status: "Suspicious",
    time: "1 hour ago",
  },
];

const initialEvidence: Evidence[] = [
  {
    id: "EVD-001",
    caseId: "CASE-001",
    type: "Transaction Record",
    hash: "a83f91cd72e8b4f1...91cd",
    status: "Verified",
    block: "#1847291",
  },
  {
    id: "EVD-002",
    caseId: "CASE-001",
    type: "Wallet Evidence",
    hash: "7bd42a91e6c84f2a...72fa",
    status: "Verified",
    block: "#1847298",
  },
  {
    id: "EVD-003",
    caseId: "CASE-002",
    type: "Investigation Report",
    hash: "91bc772a4d8e23c1...772a",
    status: "Tampered",
    block: "#1847312",
  },
];

export default function Blockchain() {
  const location = useLocation();

  const selectedWallet = location.state?.wallet || null;

  const [search, setSearch] = useState("");
  const [searchedWallet, setSearchedWallet] = useState("");
  const [evidence, setEvidence] = useState(initialEvidence);
  const [verificationMessage, setVerificationMessage] = useState("");

  const activeWallet = selectedWallet || searchedWallet;

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.from.toLowerCase().includes(activeWallet.toLowerCase()) ||
      tx.to.toLowerCase().includes(activeWallet.toLowerCase())
  );

  const verifyEvidence = (evidenceId: string) => {
    setEvidence((current) =>
      current.map((item) =>
        item.id === evidenceId
          ? { ...item, status: "Verified" }
          : item
      )
    );

    setVerificationMessage(
      `${evidenceId} verified successfully. Evidence hash matches the blockchain record.`
    );
  };

  const searchWallet = () => {
    if (search.trim()) {
      setSearchedWallet(search.trim());
      setVerificationMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Link2 className="h-6 w-6 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-400">
                BLOCKCHAIN INTELLIGENCE
              </span>
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Blockchain Analysis
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Analyze wallet activity and verify investigation evidence.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-emerald-400">
              Blockchain Network Online
            </span>
          </div>
        </div>

        {/* WALLET SEARCH */}
        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-cyan-400" />
            <h2 className="font-semibold">Wallet Investigation</h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchWallet();
                  }
                }}
                placeholder="Search wallet address or wallet name..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-cyan-500"
              />
            </div>

            <button
              onClick={searchWallet}
              className="rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Analyze Wallet
            </button>
          </div>
        </div>

        {/* ACTIVE WALLET */}
        {activeWallet && (
          <div className="mb-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-cyan-400">
                  Investigation Target
                </p>

                <p className="mt-1 break-all text-lg font-semibold">
                  {activeWallet}
                </p>
              </div>

              <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                High Risk Wallet
              </div>
            </div>
          </div>
        )}

        {/* WALLET STATS */}
        {activeWallet && (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<Wallet className="h-5 w-5" />}
              title="Wallet Risk"
              value="HIGH"
              description="Risk classification"
            />

            <StatCard
              icon={<Activity className="h-5 w-5" />}
              title="Transactions"
              value="24"
              description="Analyzed transactions"
            />

            <StatCard
              icon={<AlertTriangle className="h-5 w-5" />}
              title="Suspicious"
              value="7"
              description="Suspicious transactions"
            />

            <StatCard
              icon={<Link2 className="h-5 w-5" />}
              title="Connections"
              value="4"
              description="Connected wallets"
            />
          </div>
        )}

        {/* TRANSACTIONS */}
        {activeWallet ? (
          <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/70">
            <div className="border-b border-slate-800 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">Transaction Activity</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Recent blockchain transactions
                  </p>
                </div>

                <Activity className="h-5 w-5 text-cyan-400" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead className="bg-slate-950/60 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Transaction</th>
                    <th className="px-5 py-4">From</th>
                    <th className="px-5 py-4">To</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Time</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {filteredTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="transition hover:bg-slate-800/40"
                    >
                      <td className="px-5 py-4 font-medium text-cyan-400">
                        {tx.id}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-300">
                        {tx.from}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-300">
                        {tx.to}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium">
                        {tx.amount}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            tx.status === "Suspicious"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-emerald-500/10 text-emerald-400"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {tx.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTransactions.length === 0 && (
              <div className="p-10 text-center text-sm text-slate-500">
                No transactions found for this wallet.
              </div>
            )}
          </div>
        ) : (
          <div className="mb-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-10 text-center">
            <Wallet className="mx-auto mb-4 h-10 w-10 text-slate-600" />

            <h2 className="font-semibold text-slate-300">
              No Wallet Selected
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Search for a wallet or open Blockchain from another
              investigation to analyze blockchain activity.
            </p>
          </div>
        )}

        {/* ------------------------------------------------ */}
        {/* BLOCKCHAIN EVIDENCE VERIFICATION */}
        {/* ------------------------------------------------ */}

        <div className="mb-8 rounded-2xl border border-violet-500/20 bg-slate-900/70">

          {/* SECTION HEADER */}
          <div className="border-b border-slate-800 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-violet-500/10 p-3">
                  <FileCheck className="h-6 w-6 text-violet-400" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    Blockchain Evidence Verification
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Verify investigation evidence using blockchain hashes.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-violet-500/10 px-3 py-2 text-xs text-violet-400">
                <Database className="h-4 w-4" />
                Evidence Ledger
              </div>
            </div>
          </div>

          {/* SIMPLE EXPLANATION */}
          <div className="border-b border-slate-800 p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">

              <BlockchainStep
                number="1"
                title="Evidence"
                text="Investigation evidence is collected."
              />

              <BlockchainStep
                number="2"
                title="Hash"
                text="A unique digital hash is generated."
              />

              <BlockchainStep
                number="3"
                title="Blockchain"
                text="The hash is recorded securely."
              />

              <BlockchainStep
                number="4"
                title="Verify"
                text="Evidence integrity is checked."
              />

            </div>
          </div>

          {/* VERIFICATION MESSAGE */}
          {verificationMessage && (
            <div className="m-4 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 sm:m-5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

              <p className="text-sm text-emerald-300">
                {verificationMessage}
              </p>
            </div>
          )}

          {/* EVIDENCE TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">

              <thead className="bg-slate-950/60 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">Evidence</th>
                  <th className="px-5 py-4">Case</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Hash</th>
                  <th className="px-5 py-4">Block</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">

                {evidence.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-slate-800/40"
                  >

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-violet-400" />
                        <span className="font-medium">
                          {item.id}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-cyan-400">
                      {item.caseId}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-300">
                      {item.type}
                    </td>

                    <td className="px-5 py-4">
                      <code className="rounded bg-slate-950 px-2 py-1 text-xs text-slate-400">
                        {item.hash}
                      </code>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-400">
                      {item.block}
                    </td>

                    <td className="px-5 py-4">
                      {item.status === "Verified" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                          <XCircle className="h-3.5 w-3.5" />
                          Tampered
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => verifyEvidence(item.id)}
                        className="inline-flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs font-medium text-violet-300 transition hover:bg-violet-500/20"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Verify
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          </div>
        </div>

        {/* BLOCKCHAIN CONCEPT */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6">

          <div className="mb-5 flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />

            <div>
              <h2 className="font-semibold">
                Evidence Integrity
              </h2>

              <p className="text-sm text-slate-500">
                Simple blockchain-based evidence verification concept.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 text-center md:flex-row md:text-left">

            <ConceptBox
              icon={<FileCheck className="h-5 w-5" />}
              title="Investigation Evidence"
              text="Evidence collected by investigators"
            />

            <ArrowRight className="hidden h-5 w-5 text-slate-600 md:block" />

            <ConceptBox
              icon={<Database className="h-5 w-5" />}
              title="Digital Hash"
              text="Unique fingerprint of the evidence"
            />

            <ArrowRight className="hidden h-5 w-5 text-slate-600 md:block" />

            <ConceptBox
              icon={<Link2 className="h-5 w-5" />}
              title="Blockchain"
              text="Hash stored in an immutable ledger"
            />

            <ArrowRight className="hidden h-5 w-5 text-slate-600 md:block" />

            <ConceptBox
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Verification"
              text="Detect evidence modification"
            />

          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-8 border-t border-slate-800 pt-5 text-center text-xs text-slate-600">
          NEXUS Crime AI • Blockchain Intelligence Module • Frontend Demo
        </div>

      </div>
    </div>
  );
}

/* --------------------------------------------- */
/* STAT CARD */
/* --------------------------------------------- */

function StatCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
          {icon}
        </div>
      </div>

      <p className="text-sm text-slate-500">{title}</p>

      <p className="mt-1 text-2xl font-bold">{value}</p>

      <p className="mt-1 text-xs text-slate-600">
        {description}
      </p>
    </div>
  );
}

/* --------------------------------------------- */
/* BLOCKCHAIN STEP */
/* --------------------------------------------- */

function BlockchainStep({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">

      <div className="mb-3 flex items-center gap-3">

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/10 text-sm font-bold text-violet-400">
          {number}
        </div>

        <h3 className="font-medium">{title}</h3>

      </div>

      <p className="text-xs leading-5 text-slate-500">
        {text}
      </p>

    </div>
  );
}

/* --------------------------------------------- */
/* CONCEPT BOX */
/* --------------------------------------------- */

function ConceptBox({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="w-full rounded-xl border border-slate-800 bg-slate-950/60 p-4 md:w-56">

      <div className="mb-3 flex justify-center text-violet-400 md:justify-start">
        {icon}
      </div>

      <h3 className="text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {text}
      </p>

    </div>
  );
}