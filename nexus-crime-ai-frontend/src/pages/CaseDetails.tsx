import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Network,
  Bot,
  Wallet,
  User,
  FileText,
  AlertTriangle,
  Clock,
  Shield,
  Activity,
  CheckCircle2,
  Circle,
  Search,
  ExternalLink,
} from "lucide-react";

type CaseData = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  updated: string;
  riskScore: number;
  suspects: {
    name: string;
    role: string;
    risk: string;
  }[];
  wallets: {
    name: string;
    risk: string;
    activity: string;
  }[];
  evidence: {
    title: string;
    type: string;
    status: string;
  }[];
  findings: string[];
};

const caseData: Record<string, CaseData> = {
  "CASE-001": {
    id: "CASE-001",
    title: "Operation Dark Web",
    description:
      "Investigation into a suspected criminal network involving multiple high-risk entities, cryptocurrency wallets and connected devices.",
    status: "Active",
    priority: "Critical",
    updated: "10 min ago",
    riskScore: 92,

    suspects: [
      {
        name: "Person A",
        role: "Primary Suspect",
        risk: "CRITICAL",
      },
      {
        name: "Person B",
        role: "Associate",
        risk: "HIGH",
      },
      {
        name: "Person C",
        role: "Financial Link",
        risk: "HIGH",
      },
      {
        name: "Person D",
        role: "Unknown",
        risk: "MEDIUM",
      },
    ],

    wallets: [
      {
        name: "Wallet A",
        risk: "HIGH",
        activity: "247 transactions",
      },
      {
        name: "Wallet B",
        risk: "MEDIUM",
        activity: "83 transactions",
      },
      {
        name: "Wallet C",
        risk: "HIGH",
        activity: "156 transactions",
      },
    ],

    evidence: [
      {
        title: "Suspicious cryptocurrency transactions",
        type: "Blockchain",
        status: "Verified",
      },
      {
        title: "Connected communication records",
        type: "Communication",
        status: "Verified",
      },
      {
        title: "High-risk device relationship",
        type: "Device",
        status: "Under Review",
      },
      {
        title: "Dark web activity indicators",
        type: "Digital",
        status: "Verified",
      },
    ],

    findings: [
      "Network appears to be centered around Person A.",
      "Wallet A shows a high-risk transaction pattern.",
      "Multiple entities share common connections.",
      "Several transactions require further blockchain investigation.",
    ],
  },

  "CASE-002": {
    id: "CASE-002",
    title: "Crypto Laundering Network",
    description:
      "Suspicious cryptocurrency transfers detected across interconnected wallets.",
    status: "Investigating",
    priority: "High",
    updated: "32 min ago",
    riskScore: 87,

    suspects: [
      {
        name: "Person A",
        role: "Primary Suspect",
        risk: "HIGH",
      },
      {
        name: "Person E",
        role: "Financial Associate",
        risk: "HIGH",
      },
      {
        name: "Person F",
        role: "Unknown",
        risk: "MEDIUM",
      },
    ],

    wallets: [
      {
        name: "Wallet A",
        risk: "HIGH",
        activity: "247 transactions",
      },
      {
        name: "Wallet D",
        risk: "HIGH",
        activity: "134 transactions",
      },
      {
        name: "Wallet E",
        risk: "MEDIUM",
        activity: "76 transactions",
      },
    ],

    evidence: [
      {
        title: "High-value crypto transfers",
        type: "Blockchain",
        status: "Verified",
      },
      {
        title: "Wallet-to-wallet relationships",
        type: "Blockchain",
        status: "Verified",
      },
      {
        title: "Repeated transaction patterns",
        type: "Financial",
        status: "Under Review",
      },
    ],

    findings: [
      "Several wallets show suspicious transaction behavior.",
      "Funds appear to move through multiple intermediary wallets.",
      "Wallet A requires priority investigation.",
    ],
  },

  "CASE-003": {
    id: "CASE-003",
    title: "Synthetic Identity Ring",
    description:
      "Multiple identities connected through common devices and communication patterns.",
    status: "Investigating",
    priority: "High",
    updated: "1 hour ago",
    riskScore: 79,

    suspects: [
      {
        name: "Person B",
        role: "Primary Suspect",
        risk: "HIGH",
      },
      {
        name: "Person C",
        role: "Associate",
        risk: "HIGH",
      },
      {
        name: "Person G",
        role: "Unknown",
        risk: "MEDIUM",
      },
      {
        name: "Person H",
        role: "Unknown",
        risk: "MEDIUM",
      },
    ],

    wallets: [
      {
        name: "Wallet B",
        risk: "MEDIUM",
        activity: "93 transactions",
      },
      {
        name: "Wallet F",
        risk: "HIGH",
        activity: "119 transactions",
      },
    ],

    evidence: [
      {
        title: "Shared device identifiers",
        type: "Device",
        status: "Verified",
      },
      {
        title: "Repeated identity patterns",
        type: "Identity",
        status: "Verified",
      },
      {
        title: "Common communication links",
        type: "Communication",
        status: "Under Review",
      },
    ],

    findings: [
      "Several identities share common infrastructure.",
      "Device relationships indicate possible coordination.",
    ],
  },

  "CASE-004": {
    id: "CASE-004",
    title: "Illegal Payment Network",
    description:
      "Analysis of suspicious payment relationships between known entities.",
    status: "Active",
    priority: "Medium",
    updated: "3 hours ago",
    riskScore: 68,

    suspects: [
      {
        name: "Person D",
        role: "Primary Suspect",
        risk: "HIGH",
      },
      {
        name: "Person I",
        role: "Associate",
        risk: "MEDIUM",
      },
    ],

    wallets: [
      {
        name: "Wallet C",
        risk: "HIGH",
        activity: "156 transactions",
      },
      {
        name: "Wallet G",
        risk: "MEDIUM",
        activity: "54 transactions",
      },
    ],

    evidence: [
      {
        title: "Suspicious payment relationships",
        type: "Financial",
        status: "Verified",
      },
      {
        title: "Repeated transfers",
        type: "Blockchain",
        status: "Under Review",
      },
    ],

    findings: [
      "Payment relationships form a small interconnected network.",
      "Further wallet analysis is recommended.",
    ],
  },

  "CASE-005": {
    id: "CASE-005",
    title: "Dark Market Investigation",
    description:
      "Previously investigated criminal marketplace network.",
    status: "Closed",
    priority: "Medium",
    updated: "Yesterday",
    riskScore: 41,

    suspects: [
      {
        name: "Person J",
        role: "Suspect",
        risk: "MEDIUM",
      },
      {
        name: "Person K",
        role: "Associate",
        risk: "LOW",
      },
      {
        name: "Person L",
        role: "Unknown",
        risk: "LOW",
      },
    ],

    wallets: [
      {
        name: "Wallet H",
        risk: "MEDIUM",
        activity: "42 transactions",
      },
      {
        name: "Wallet I",
        risk: "LOW",
        activity: "18 transactions",
      },
    ],

    evidence: [
      {
        title: "Marketplace transaction records",
        type: "Financial",
        status: "Verified",
      },
      {
        title: "Historical wallet relationships",
        type: "Blockchain",
        status: "Verified",
      },
    ],

    findings: [
      "Investigation has been completed.",
      "Historical entities remain available for analysis.",
    ],
  },
};

export default function CaseDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const caseId = location.state?.caseId || "CASE-001";

  const data =
    caseData[caseId] || caseData["CASE-001"];

  const openNetwork = () => {
    navigate("/network", {
      state: {
        caseId: data.id,
        caseTitle: data.title,
      },
    });
  };

  const openAI = () => {
    navigate("/ai", {
      state: {
        entity: data.suspects[0]?.name || "Person A",
      },
    });
  };

  const openBlockchain = () => {
    navigate("/blockchain", {
      state: {
        wallet: data.wallets[0]?.name || "Wallet A",
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-8">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">

        <div>

          <button
            onClick={() => navigate("/cases")}
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition mb-4"
          >
            <ArrowLeft size={18} />
            Back to Cases
          </button>

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Shield
                className="text-cyan-400"
                size={25}
              />
            </div>

            <div>

              <p className="text-xs text-cyan-400 uppercase tracking-widest">
                Case Investigation
              </p>

              <h1 className="text-3xl font-bold mt-1">
                {data.title}
              </h1>

              <p className="text-slate-500 text-sm mt-1">
                {data.id}
              </p>

            </div>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <div className="px-4 py-2 rounded-lg border border-slate-800 bg-slate-900 text-sm">
            Priority:
            <span className="text-red-400 ml-2">
              {data.priority}
            </span>
          </div>

          <div
            className={`px-4 py-2 rounded-lg border text-sm ${
              data.status === "Active"
                ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                : data.status === "Investigating"
                ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                : "bg-green-500/10 text-green-400 border-green-500/20"
            }`}
          >
            {data.status}
          </div>

        </div>

      </div>

      {/* RISK + OVERVIEW */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">

        <div className="rounded-2xl border border-red-500/20 bg-slate-900 p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs text-slate-500 uppercase tracking-widest">
                Case Risk Score
              </p>

              <p className="text-5xl font-bold text-red-400 mt-3">
                {data.riskScore}
              </p>

              <p className="text-sm text-red-400 mt-1">
                {data.riskScore >= 85
                  ? "CRITICAL RISK"
                  : data.riskScore >= 70
                  ? "HIGH RISK"
                  : data.riskScore >= 50
                  ? "MEDIUM RISK"
                  : "LOW RISK"}
              </p>

            </div>

            <AlertTriangle
              size={38}
              className="text-red-400"
            />

          </div>

          <div className="w-full h-2 bg-slate-800 rounded-full mt-6">

            <div
              className="h-2 rounded-full bg-red-400"
              style={{
                width: `${data.riskScore}%`,
              }}
            />

          </div>

        </div>

        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="flex items-center gap-2 mb-3">

            <FileText
              size={19}
              className="text-cyan-400"
            />

            <h2 className="text-lg font-semibold">
              Case Overview
            </h2>

          </div>

          <p className="text-slate-400 leading-7">
            {data.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">

            <InfoBox
              label="Suspects"
              value={String(data.suspects.length)}
            />

            <InfoBox
              label="Wallets"
              value={String(data.wallets.length)}
            />

            <InfoBox
              label="Evidence"
              value={String(data.evidence.length)}
            />

            <InfoBox
              label="Updated"
              value={data.updated}
            />

          </div>

        </div>

      </div>

      {/* INVESTIGATION TOOLS */}

      <section className="mb-7">

        <div className="flex items-center justify-between mb-4">

          <h2 className="text-lg font-semibold">
            Investigation Tools
          </h2>

          <span className="text-xs text-slate-500">
            Select an analysis module
          </span>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <ActionCard
            icon={<Network size={23} />}
            title="Network Analysis"
            description="Analyze relationships between suspects, devices and wallets."
            onClick={openNetwork}
          />

          <ActionCard
            icon={<Bot size={23} />}
            title="AI Investigation"
            description="Generate intelligence insights for suspicious entities."
            onClick={openAI}
          />

          <ActionCard
            icon={<Wallet size={23} />}
            title="Blockchain Analysis"
            description="Investigate wallet activity and suspicious transactions."
            onClick={openBlockchain}
          />

        </div>

      </section>

      {/* SUSPECTS + WALLETS */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">

        {/* SUSPECTS */}

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="flex items-center justify-between mb-5">

            <div className="flex items-center gap-2">

              <User
                size={19}
                className="text-violet-400"
              />

              <h2 className="text-lg font-semibold">
                Suspects & Entities
              </h2>

            </div>

            <span className="text-xs text-slate-500">
              {data.suspects.length} entities
            </span>

          </div>

          <div className="space-y-3">

            {data.suspects.map((suspect) => (

              <div
                key={suspect.name}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800"
              >

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center">

                    <User
                      size={17}
                      className="text-violet-400"
                    />

                  </div>

                  <div>

                    <p className="text-sm font-medium">
                      {suspect.name}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {suspect.role}
                    </p>

                  </div>

                </div>

                <RiskBadge risk={suspect.risk} />

              </div>

            ))}

          </div>

        </section>

        {/* WALLETS */}

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="flex items-center justify-between mb-5">

            <div className="flex items-center gap-2">

              <Wallet
                size={19}
                className="text-cyan-400"
              />

              <h2 className="text-lg font-semibold">
                Associated Wallets
              </h2>

            </div>

            <span className="text-xs text-slate-500">
              {data.wallets.length} wallets
            </span>

          </div>

          <div className="space-y-3">

            {data.wallets.map((wallet) => (

              <button
                key={wallet.name}
                onClick={() =>
                  navigate("/blockchain", {
                    state: {
                      wallet: wallet.name,
                    },
                  })
                }
                className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition text-left"
              >

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center">

                    <Wallet
                      size={17}
                      className="text-cyan-400"
                    />

                  </div>

                  <div>

                    <p className="text-sm font-medium">
                      {wallet.name}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {wallet.activity}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <RiskBadge risk={wallet.risk} />

                  <ExternalLink
                    size={14}
                    className="text-slate-600"
                  />

                </div>

              </button>

            ))}

          </div>

        </section>

      </div>

      {/* EVIDENCE */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 mb-6">

        <div className="flex items-center gap-2 mb-5">

          <Search
            size={19}
            className="text-orange-400"
          />

          <h2 className="text-lg font-semibold">
            Evidence
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          {data.evidence.map((item) => (

            <div
              key={item.title}
              className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800"
            >

              <div>

                <p className="text-sm text-slate-200">
                  {item.title}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {item.type}
                </p>

              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  item.status === "Verified"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-orange-500/10 text-orange-400"
                }`}
              >
                {item.status}
              </span>

            </div>

          ))}

        </div>

      </section>

      {/* AI FINDINGS */}

      <section className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.03] p-6 mb-6">

        <div className="flex items-center justify-between mb-5">

          <div className="flex items-center gap-2">

            <Bot
              size={19}
              className="text-cyan-400"
            />

            <h2 className="text-lg font-semibold">
              AI Intelligence Findings
            </h2>

          </div>

          <button
            onClick={openAI}
            className="text-xs text-cyan-400 hover:text-cyan-300"
          >
            Open AI Assistant →
          </button>

        </div>

        <div className="space-y-3">

          {data.findings.map((finding, index) => (

            <div
              key={index}
              className="flex gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800"
            >

              <div className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>

              <p className="text-sm text-slate-300 leading-6">
                {finding}
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* INVESTIGATION TIMELINE */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <div className="flex items-center gap-2 mb-6">

          <Clock
            size={19}
            className="text-cyan-400"
          />

          <h2 className="text-lg font-semibold">
            Investigation Timeline
          </h2>

        </div>

        <div className="space-y-6">

          <TimelineItem
            title="Case created"
            description="Investigation case initialized in NEXUS-CRIME AI."
            time="Today, 09:10"
            complete
          />

          <TimelineItem
            title="Network entities identified"
            description="Multiple connected suspects and entities detected."
            time="Today, 10:25"
            complete
          />

          <TimelineItem
            title="Wallet activity analyzed"
            description="Suspicious cryptocurrency transaction patterns identified."
            time="Today, 11:40"
            complete
          />

          <TimelineItem
            title="AI intelligence analysis"
            description="AI-generated findings require investigator review."
            time="Today, 12:15"
            complete
          />

          <TimelineItem
            title="Investigation pending"
            description="Further evidence analysis required."
            time="Current"
          />

        </div>

      </section>

      {/* FOOTER */}

      <div className="flex items-center gap-2 mt-6 text-xs text-slate-500">

        <Activity size={14} />

        Last updated: {data.updated}

      </div>

    </div>
  );
}

/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-950 border border-slate-800 p-4">

      <p className="text-xs text-slate-500 mb-2">
        {label}
      </p>

      <p className="font-semibold text-white">
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   ACTION CARD
========================================================= */

function ActionCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-2xl border border-slate-800 bg-slate-900 p-5 hover:border-cyan-500/40 hover:bg-cyan-500/[0.03] transition group"
    >

      <div className="w-11 h-11 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-105 transition">
        {icon}
      </div>

      <h3 className="font-semibold text-white">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mt-2 leading-6">
        {description}
      </p>

      <div className="text-xs text-cyan-400 mt-4">
        Open Analysis →
      </div>

    </button>
  );
}

/* =========================================================
   RISK BADGE
========================================================= */

function RiskBadge({
  risk,
}: {
  risk: string;
}) {
  const styles: Record<string, string> = {
    CRITICAL:
      "bg-red-500/10 text-red-400 border-red-500/20",

    HIGH:
      "bg-orange-500/10 text-orange-400 border-orange-500/20",

    MEDIUM:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

    LOW:
      "bg-green-500/10 text-green-400 border-green-500/20",
  };

  return (
    <span
      className={`text-[10px] px-2.5 py-1 rounded-full border ${
        styles[risk] || styles.MEDIUM
      }`}
    >
      {risk}
    </span>
  );
}

/* =========================================================
   TIMELINE ITEM
========================================================= */

function TimelineItem({
  title,
  description,
  time,
  complete = false,
}: {
  title: string;
  description: string;
  time: string;
  complete?: boolean;
}) {
  return (
    <div className="flex gap-4">

      <div className="flex flex-col items-center">

        {complete ? (
          <CheckCircle2
            size={20}
            className="text-cyan-400"
          />
        ) : (
          <Circle
            size={20}
            className="text-slate-600"
          />
        )}

        <div className="w-px flex-1 bg-slate-800 mt-2" />

      </div>

      <div className="pb-4 flex-1">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">

          <h3 className="text-sm font-medium">
            {title}
          </h3>

          <span className="text-xs text-slate-600">
            {time}
          </span>

        </div>

        <p className="text-xs text-slate-500 mt-2">
          {description}
        </p>

      </div>

    </div>
  );
}