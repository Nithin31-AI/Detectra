import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Search,
  ShieldAlert,
  Clock,
  CheckCircle2,
  ArrowRight,
  User,
  Wallet,
  Smartphone,
  Network,
  Bot,
  Activity,
  Eye,
  X,
  FileSearch,
  ExternalLink,
} from "lucide-react";

type Severity = "Critical" | "High" | "Medium" | "Low";
type Status = "New" | "Investigating" | "Resolved";

type AlertItem = {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: Status;
  entity: string;
  time: string;
  riskScore: number;
  recommendation: string;
};

const alerts: AlertItem[] = [
  {
    id: "ALT-001",
    title: "High-Risk Wallet Activity",
    description:
      "Multiple suspicious transactions detected from Wallet A.",
    severity: "Critical",
    status: "New",
    entity: "Wallet A",
    time: "5 min ago",
    riskScore: 96,
    recommendation:
      "Trace Wallet A transaction flow and identify connected entities.",
  },
  {
    id: "ALT-002",
    title: "Criminal Network Expansion",
    description:
      "Person A has established new connections with high-risk entities.",
    severity: "High",
    status: "Investigating",
    entity: "Person A",
    time: "18 min ago",
    riskScore: 92,
    recommendation:
      "Analyze Person A's network and identify newly connected entities.",
  },
  {
    id: "ALT-003",
    title: "Suspicious Transaction Pattern",
    description:
      "Unusual transaction flow detected between connected wallets.",
    severity: "High",
    status: "New",
    entity: "Wallet B",
    time: "32 min ago",
    riskScore: 87,
    recommendation:
      "Investigate Wallet B and compare transaction relationships.",
  },
  {
    id: "ALT-004",
    title: "New Device Connection",
    description:
      "A previously unknown device has connected to the network.",
    severity: "Medium",
    status: "Investigating",
    entity: "Device A",
    time: "1 hour ago",
    riskScore: 64,
    recommendation:
      "Map Device A against known persons and network activity.",
  },
  {
    id: "ALT-005",
    title: "Risk Score Updated",
    description:
      "Entity risk score changed after AI analysis.",
    severity: "Medium",
    status: "Resolved",
    entity: "Person B",
    time: "2 hours ago",
    riskScore: 52,
    recommendation:
      "Review the AI-generated risk assessment for Person B.",
  },
  {
    id: "ALT-006",
    title: "Unusual Network Activity",
    description:
      "Abnormal communication pattern detected in Network #24.",
    severity: "Low",
    status: "Resolved",
    entity: "Network #24",
    time: "4 hours ago",
    riskScore: 38,
    recommendation:
      "Review network communication patterns for anomalies.",
  },
];

function getSeverityClass(severity: Severity) {
  switch (severity) {
    case "Critical":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "High":
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    case "Medium":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    default:
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  }
}

function getStatusClass(status: Status) {
  switch (status) {
    case "New":
      return "bg-red-500/10 text-red-400";
    case "Investigating":
      return "bg-cyan-500/10 text-cyan-400";
    default:
      return "bg-green-500/10 text-green-400";
  }
}

function EntityIcon({ entity }: { entity: string }) {
  if (entity.startsWith("Wallet")) {
    return <Wallet size={17} />;
  }

  if (entity.startsWith("Person")) {
    return <User size={17} />;
  }

  if (entity.startsWith("Device")) {
    return <Smartphone size={17} />;
  }

  return <Network size={17} />;
}

export default function Alerts() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        alert.title.toLowerCase().includes(searchText) ||
        alert.entity.toLowerCase().includes(searchText) ||
        alert.description.toLowerCase().includes(searchText);

      const matchesSeverity =
        severityFilter === "All" || alert.severity === severityFilter;

      const matchesStatus =
        statusFilter === "All" || alert.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [search, severityFilter, statusFilter]);

  const criticalCount = alerts.filter(
    (alert) => alert.severity === "Critical"
  ).length;

  const highCount = alerts.filter(
    (alert) => alert.severity === "High"
  ).length;

  const investigatingCount = alerts.filter(
    (alert) => alert.status === "Investigating"
  ).length;

  const resolvedCount = alerts.filter(
    (alert) => alert.status === "Resolved"
  ).length;

  const investigateAlert = (alert: AlertItem) => {
    if (alert.entity.startsWith("Wallet")) {
      navigate("/blockchain", {
        state: {
          wallet: alert.entity,
        },
      });
      return;
    }

    if (alert.entity.startsWith("Person")) {
      navigate("/ai", {
        state: {
          entity: alert.entity,
        },
      });
      return;
    }

    navigate("/network");
  };

  const openNetwork = () => {
    navigate("/network");
  };

  const openAI = () => {
    if (selectedAlert?.entity.startsWith("Person")) {
      navigate("/ai", {
        state: {
          entity: selectedAlert.entity,
        },
      });
    } else {
      navigate("/ai");
    }
  };

  const openWallet = () => {
    if (selectedAlert?.entity.startsWith("Wallet")) {
      navigate("/blockchain", {
        state: {
          wallet: selectedAlert.entity,
        },
      });
    }
  };

  return (
    <div className="min-h-screen p-8 bg-slate-950 text-white">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <ShieldAlert className="text-red-400" size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Security Alerts
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Monitor and investigate detected threats
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-green-500/20 bg-green-500/5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

          <span className="text-xs text-green-400">
            Live Monitoring
          </span>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div
          className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 cursor-pointer hover:bg-red-500/10 transition"
          onClick={() => setSeverityFilter("Critical")}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 uppercase tracking-wider">
              Critical
            </p>

            <AlertTriangle className="text-red-400" size={20} />
          </div>

          <p className="text-3xl font-bold text-red-400 mt-3">
            {criticalCount}
          </p>

          <p className="text-xs text-slate-600 mt-1">
            Immediate attention
          </p>
        </div>

        <div
          className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-5 cursor-pointer hover:bg-orange-500/10 transition"
          onClick={() => setSeverityFilter("High")}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 uppercase tracking-wider">
              High Risk
            </p>

            <ShieldAlert className="text-orange-400" size={20} />
          </div>

          <p className="text-3xl font-bold text-orange-400 mt-3">
            {highCount}
          </p>

          <p className="text-xs text-slate-600 mt-1">
            Requires investigation
          </p>
        </div>

        <div
          className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5 cursor-pointer hover:bg-cyan-500/10 transition"
          onClick={() => setStatusFilter("Investigating")}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 uppercase tracking-wider">
              Investigating
            </p>

            <Activity className="text-cyan-400" size={20} />
          </div>

          <p className="text-3xl font-bold text-cyan-400 mt-3">
            {investigatingCount}
          </p>

          <p className="text-xs text-slate-600 mt-1">
            Active investigations
          </p>
        </div>

        <div
          className="rounded-xl border border-green-500/20 bg-green-500/5 p-5 cursor-pointer hover:bg-green-500/10 transition"
          onClick={() => setStatusFilter("Resolved")}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 uppercase tracking-wider">
              Resolved
            </p>

            <CheckCircle2 className="text-green-400" size={20} />
          </div>

          <p className="text-3xl font-bold text-green-400 mt-3">
            {resolvedCount}
          </p>

          <p className="text-xs text-slate-600 mt-1">
            Completed alerts
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search alerts, entities..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/40"
            />
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-300 outline-none"
          >
            <option value="All">All Severity</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-300 outline-none"
          >
            <option value="All">All Status</option>
            <option value="New">New</option>
            <option value="Investigating">Investigating</option>
            <option value="Resolved">Resolved</option>
          </select>

          {(search || severityFilter !== "All" || statusFilter !== "All") && (
            <button
              onClick={() => {
                setSearch("");
                setSeverityFilter("All");
                setStatusFilter("All");
              }}
              className="px-3 py-2.5 rounded-lg border border-slate-800 text-xs text-slate-400 hover:text-white hover:border-slate-700 transition"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-[1fr_360px] gap-6">
        {/* ALERT LIST */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">
              Showing{" "}
              <span className="text-white font-medium">
                {filteredAlerts.length}
              </span>{" "}
              alerts
            </p>

            <p className="text-xs text-slate-600">
              AI threat detection active
            </p>
          </div>

          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => setSelectedAlert(alert)}
              className={`rounded-xl border bg-slate-900/50 p-5 cursor-pointer transition ${
                selectedAlert?.id === alert.id
                  ? "border-cyan-500/40 bg-cyan-500/5"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  {/* ICON */}
                  <div
                    className={`w-11 h-11 rounded-lg border flex items-center justify-center ${getSeverityClass(
                      alert.severity
                    )}`}
                  >
                    <AlertTriangle size={20} />
                  </div>

                  {/* CONTENT */}
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-white">
                        {alert.title}
                      </h3>

                      <span
                        className={`text-[10px] px-2 py-1 rounded border uppercase tracking-wider ${getSeverityClass(
                          alert.severity
                        )}`}
                      >
                        {alert.severity}
                      </span>

                      <span
                        className={`text-[10px] px-2 py-1 rounded uppercase tracking-wider ${getStatusClass(
                          alert.status
                        )}`}
                      >
                        {alert.status}
                      </span>
                    </div>

                    <p className="text-sm text-slate-500 mt-2">
                      {alert.description}
                    </p>

                    <div className="flex items-center gap-5 mt-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <EntityIcon entity={alert.entity} />
                        {alert.entity}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock size={14} />
                        {alert.time}
                      </div>

                      <span className="text-[10px] text-slate-600">
                        {alert.id}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    investigateAlert(alert);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm hover:bg-cyan-500/20 transition"
                >
                  Investigate
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}

          {filteredAlerts.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-800 p-12 text-center">
              <ShieldAlert
                size={32}
                className="mx-auto text-slate-700 mb-3"
              />

              <p className="text-sm text-slate-500">
                No alerts match your filters.
              </p>
            </div>
          )}
        </div>

        {/* ALERT INTELLIGENCE PANEL */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 h-fit sticky top-6">
          {!selectedAlert ? (
            <div className="py-12 text-center">
              <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                <Eye className="text-cyan-400" size={26} />
              </div>

              <h3 className="text-sm font-semibold text-white">
                Alert Intelligence
              </h3>

              <p className="text-xs text-slate-600 mt-2 leading-5">
                Select an alert to view AI-generated intelligence,
                risk information and investigation actions.
              </p>
            </div>
          ) : (
            <>
              {/* PANEL HEADER */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <FileSearch
                      size={18}
                      className="text-cyan-400"
                    />

                    <h2 className="font-semibold text-white">
                      Alert Intelligence
                    </h2>
                  </div>

                  <p className="text-[10px] text-slate-600 mt-1">
                    {selectedAlert.id}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedAlert(null)}
                  className="text-slate-600 hover:text-white transition"
                >
                  <X size={17} />
                </button>
              </div>

              {/* ALERT TITLE */}
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle
                    size={17}
                    className="text-red-400"
                  />

                  <span className="text-xs text-slate-400">
                    Detected Threat
                  </span>
                </div>

                <p className="text-sm font-semibold text-white">
                  {selectedAlert.title}
                </p>

                <p className="text-xs text-slate-500 mt-2 leading-5">
                  {selectedAlert.description}
                </p>
              </div>

              {/* RISK SCORE */}
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 uppercase tracking-wider">
                    AI Risk Score
                  </span>

                  <span
                    className={`text-xl font-bold ${
                      selectedAlert.riskScore >= 90
                        ? "text-red-400"
                        : selectedAlert.riskScore >= 70
                        ? "text-orange-400"
                        : selectedAlert.riskScore >= 50
                        ? "text-yellow-400"
                        : "text-blue-400"
                    }`}
                  >
                    {selectedAlert.riskScore}
                  </span>
                </div>

                <div className="h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full"
                    style={{
                      width: `${selectedAlert.riskScore}%`,
                    }}
                  />
                </div>

                <p className="text-[10px] text-slate-600 mt-2">
                  Confidence based on mock intelligence signals
                </p>
              </div>

              {/* ENTITY */}
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 mb-4">
                <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">
                  Primary Entity
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <EntityIcon entity={selectedAlert.entity} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      {selectedAlert.entity}
                    </p>

                    <p className="text-[10px] text-slate-600">
                      Last activity: {selectedAlert.time}
                    </p>
                  </div>
                </div>
              </div>

              {/* RECOMMENDATION */}
              <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bot size={16} className="text-cyan-400" />

                  <span className="text-xs font-medium text-cyan-400">
                    AI Recommendation
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-5">
                  {selectedAlert.recommendation}
                </p>
              </div>

              {/* QUICK ACTIONS */}
              <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">
                Investigation Actions
              </p>

              <div className="space-y-2">
                <button
                  onClick={openNetwork}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-lg border border-slate-800 bg-slate-950 text-sm text-slate-300 hover:border-cyan-500/30 hover:text-cyan-400 transition"
                >
                  <span className="flex items-center gap-2">
                    <Network size={16} />
                    View Network
                  </span>

                  <ExternalLink size={14} />
                </button>

                <button
                  onClick={openAI}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-lg border border-slate-800 bg-slate-950 text-sm text-slate-300 hover:border-cyan-500/30 hover:text-cyan-400 transition"
                >
                  <span className="flex items-center gap-2">
                    <Bot size={16} />
                    Analyze with AI
                  </span>

                  <ExternalLink size={14} />
                </button>

                {selectedAlert.entity.startsWith("Wallet") && (
                  <button
                    onClick={openWallet}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-lg border border-slate-800 bg-slate-950 text-sm text-slate-300 hover:border-cyan-500/30 hover:text-cyan-400 transition"
                  >
                    <span className="flex items-center gap-2">
                      <Wallet size={16} />
                      Investigate Wallet
                    </span>

                    <ExternalLink size={14} />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}