import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Link2,
  Network,
  ShieldAlert,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const recentAlerts = [
  {
    title: "High-Risk Wallet Activity",
    entity: "Wallet A",
    severity: "CRITICAL",
    time: "10 min ago",
  },
  {
    title: "Criminal Network Expansion",
    entity: "Person A",
    severity: "HIGH",
    time: "28 min ago",
  },
  {
    title: "Suspicious Transaction Pattern",
    entity: "Wallet B",
    severity: "HIGH",
    time: "1 hour ago",
  },
  {
    title: "New Device Connection",
    entity: "Device A",
    severity: "MEDIUM",
    time: "2 hours ago",
  },
];

const riskData = [
  {
    label: "Critical",
    count: 8,
    percentage: "80%",
    text: "text-red-400",
    bar: "bg-red-500",
    bg: "bg-red-500/5",
    border: "border-red-500/10",
  },
  {
    label: "High",
    count: 24,
    percentage: "65%",
    text: "text-orange-400",
    bar: "bg-orange-500",
    bg: "bg-orange-500/5",
    border: "border-orange-500/10",
  },
  {
    label: "Medium",
    count: 47,
    percentage: "48%",
    text: "text-yellow-400",
    bar: "bg-yellow-500",
    bg: "bg-yellow-500/5",
    border: "border-yellow-500/10",
  },
  {
    label: "Low",
    count: 69,
    percentage: "30%",
    text: "text-blue-400",
    bar: "bg-blue-500",
    bg: "bg-blue-500/5",
    border: "border-blue-500/10",
  },
];

function getAlertSeverityClass(severity: string) {
  switch (severity) {
    case "CRITICAL":
      return "text-red-400 bg-red-500/10 border-red-500/20";
    case "HIGH":
      return "text-orange-400 bg-orange-500/10 border-orange-500/20";
    default:
      return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
  }
}

export default function Dashboard() {
  const navigate = useNavigate();

  const openRecentAlert = (
    entity: string,
    title: string
  ) => {
    if (entity.startsWith("Wallet")) {
      navigate("/blockchain", {
        state: {
          wallet: entity,
        },
      });
      return;
    }

    if (entity.startsWith("Person")) {
      navigate("/ai", {
        state: {
          entity,
        },
      });
      return;
    }

    navigate("/network", {
      state: {
        entity,
        alert: title,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-400 animate-ping opacity-50" />
            </div>

            <span className="text-xs text-green-400 uppercase tracking-widest">
              Intelligence System Online
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Investigation Dashboard
          </h1>

          <p className="text-sm md:text-base text-gray-400 mt-2">
            AI-powered criminal network intelligence and threat analysis
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0d1322] border border-gray-800">
            <div className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2
                size={18}
                className="text-green-400"
              />
            </div>

            <div>
              <p className="text-[10px] text-gray-600 uppercase tracking-wider">
                System Status
              </p>

              <p className="text-sm font-medium text-green-400">
                All Systems Operational
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0d1322] border border-gray-800">
            <div className="w-9 h-9 rounded-full bg-cyan-500/10 flex items-center justify-center">
              <Users size={18} className="text-cyan-400" />
            </div>

            <div>
              <p className="text-[10px] text-gray-600 uppercase tracking-wider">
                Investigator
              </p>

              <p className="text-sm font-medium">
                Admin User
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {/* CASES */}
        <button
          onClick={() => navigate("/cases")}
          className="group text-left bg-[#0d1322] border border-gray-800 rounded-xl p-5 hover:border-cyan-500/40 hover:bg-[#101829] transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              Active Cases
            </span>

            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Network
                size={19}
                className="text-cyan-400"
              />
            </div>
          </div>

          <div className="flex items-end justify-between mt-4">
            <p className="text-3xl font-bold">24</p>

            <span className="text-xs text-green-400">
              +12% this week
            </span>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <span className="text-[11px] text-cyan-400">
              Open Cases
            </span>

            <ArrowRight
              size={13}
              className="text-cyan-400 group-hover:translate-x-1 transition"
            />
          </div>
        </button>

        {/* ENTITIES */}
        <button
          onClick={() => navigate("/network")}
          className="group text-left bg-[#0d1322] border border-gray-800 rounded-xl p-5 hover:border-violet-500/40 hover:bg-[#101829] transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              Entities Analyzed
            </span>

            <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Users
                size={19}
                className="text-violet-400"
              />
            </div>
          </div>

          <div className="flex items-end justify-between mt-4">
            <p className="text-3xl font-bold">148</p>

            <span className="text-xs text-violet-400">
              +18 today
            </span>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <span className="text-[11px] text-violet-400">
              Explore Entities
            </span>

            <ArrowRight
              size={13}
              className="text-violet-400 group-hover:translate-x-1 transition"
            />
          </div>
        </button>

        {/* ALERTS */}
        <button
          onClick={() => navigate("/alerts")}
          className="group text-left bg-[#0d1322] border border-gray-800 rounded-xl p-5 hover:border-red-500/40 hover:bg-[#101829] transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              Active Alerts
            </span>

            <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
              <ShieldAlert
                size={19}
                className="text-red-400"
              />
            </div>
          </div>

          <div className="flex items-end justify-between mt-4">
            <p className="text-3xl font-bold text-red-400">
              8
            </p>

            <span className="text-xs text-red-400">
              1 critical
            </span>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <span className="text-[11px] text-red-400">
              Investigate Alerts
            </span>

            <ArrowRight
              size={13}
              className="text-red-400 group-hover:translate-x-1 transition"
            />
          </div>
        </button>

        {/* WALLETS */}
        <button
          onClick={() => navigate("/blockchain")}
          className="group text-left bg-[#0d1322] border border-gray-800 rounded-xl p-5 hover:border-green-500/40 hover:bg-[#101829] transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              Wallets Analyzed
            </span>

            <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Wallet
                size={19}
                className="text-green-400"
              />
            </div>
          </div>

          <div className="flex items-end justify-between mt-4">
            <p className="text-3xl font-bold">96</p>

            <span className="text-xs text-green-400">
              12 suspicious
            </span>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <span className="text-[11px] text-green-400">
              Open Blockchain Analysis
            </span>

            <ArrowRight
              size={13}
              className="text-green-400 group-hover:translate-x-1 transition"
            />
          </div>
        </button>
      </div>

      {/* THREAT OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
        {/* THREAT LEVEL */}
        <button
          onClick={() => navigate("/alerts")}
          className="text-left bg-[#0d1322] border border-red-500/10 rounded-xl p-6 hover:border-red-500/30 transition"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ShieldAlert
                size={20}
                className="text-red-400"
              />

              <h2 className="font-semibold">
                Current Threat Level
              </h2>
            </div>

            <span className="text-[10px] px-2 py-1 rounded border border-red-500/20 bg-red-500/10 text-red-400">
              LIVE
            </span>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 rounded-full border-[13px] border-red-500/10" />

              <div className="absolute inset-0 rounded-full border-[13px] border-red-500 border-r-transparent border-b-transparent rotate-45" />

              <div className="absolute inset-4 rounded-full bg-[#0a0f1b] flex flex-col items-center justify-center">
                <p className="text-4xl font-bold text-red-400">
                  78
                </p>

                <p className="text-xs text-gray-500">
                  / 100
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <p className="text-red-400 font-semibold tracking-wide">
              HIGH THREAT
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Multiple suspicious activities detected
            </p>

            <p className="text-[11px] text-red-400 mt-4">
              Review active alerts →
            </p>
          </div>
        </button>

        {/* RISK DISTRIBUTION */}
        <div className="bg-[#0d1322] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp
                size={20}
                className="text-orange-400"
              />

              <h2 className="font-semibold">
                Risk Distribution
              </h2>
            </div>

            <span className="text-[10px] text-gray-600">
              148 ENTITIES
            </span>
          </div>

          <div className="space-y-3">
            {riskData.map((risk) => (
              <button
                key={risk.label}
                onClick={() =>
                  navigate("/network", {
                    state: {
                      risk: risk.label,
                    },
                  })
                }
                className={`w-full text-left rounded-lg border ${risk.border} ${risk.bg} p-3 hover:bg-slate-800/40 transition`}
              >
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">
                    {risk.label}
                  </span>

                  <span
                    className={`text-sm font-semibold ${risk.text}`}
                  >
                    {risk.count}
                  </span>
                </div>

                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${risk.bar}`}
                    style={{
                      width: risk.percentage,
                    }}
                  />
                </div>
              </button>
            ))}
          </div>

          <p className="text-[10px] text-gray-600 mt-4">
            Select a risk category to explore entities.
          </p>
        </div>

        {/* AI SUMMARY */}
        <div className="bg-[#0d1322] border border-violet-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <Bot
                  size={21}
                  className="text-violet-400"
                />
              </div>

              <div>
                <h2 className="font-semibold">
                  AI Intelligence
                </h2>

                <p className="text-xs text-gray-500">
                  Latest automated analysis
                </p>
              </div>
            </div>

            <span className="text-[10px] px-2 py-1 rounded bg-violet-500/10 text-violet-400 border border-violet-500/10">
              MOCK AI
            </span>
          </div>

          <p className="text-sm text-gray-400 leading-6">
            The current investigation shows a high-risk network
            centered around Person A and Wallet A. Multiple
            suspicious transactions and high-risk connections
            have been identified.
          </p>

          <div className="mt-5 p-4 rounded-lg bg-violet-500/5 border border-violet-500/10">
            <p className="text-xs text-violet-400 uppercase tracking-wider">
              AI Recommendation
            </p>

            <p className="text-sm text-gray-300 mt-2 leading-5">
              Investigate Wallet A and its connected entities
              before expanding the investigation.
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() =>
                  navigate("/blockchain", {
                    state: {
                      wallet: "Wallet A",
                    },
                  })
                }
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-xs text-violet-400 hover:bg-violet-500/20 transition"
              >
                <Wallet size={14} />
                Investigate Wallet
              </button>

              <button
                onClick={() =>
                  navigate("/ai", {
                    state: {
                      entity: "Person A",
                    },
                  })
                }
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400 hover:bg-cyan-500/20 transition"
              >
                <Bot size={14} />
                Ask AI
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVITY + ALERTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* ACTIVITY */}
        <div className="bg-[#0d1322] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity
                size={20}
                className="text-cyan-400"
              />

              <h2 className="font-semibold">
                Investigation Activity
              </h2>
            </div>

            <span className="flex items-center gap-1.5 text-xs text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live
            </span>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => navigate("/network")}
              className="group w-full flex items-center gap-4 text-left hover:bg-slate-800/40 rounded-lg p-3 transition"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Network
                  size={18}
                  className="text-cyan-400"
                />
              </div>

              <div className="flex-1">
                <p className="text-sm">
                  Criminal network analyzed
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  5 entities connected
                </p>
              </div>

              <span className="text-xs text-gray-600 group-hover:text-cyan-400">
                5 min
              </span>
            </button>

            <button
              onClick={() => navigate("/blockchain")}
              className="group w-full flex items-center gap-4 text-left hover:bg-slate-800/40 rounded-lg p-3 transition"
            >
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Link2
                  size={18}
                  className="text-violet-400"
                />
              </div>

              <div className="flex-1">
                <p className="text-sm">
                  Blockchain wallet analyzed
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  247 transactions scanned
                </p>
              </div>

              <span className="text-xs text-gray-600 group-hover:text-violet-400">
                18 min
              </span>
            </button>

            <button
              onClick={() =>
                navigate("/blockchain", {
                  state: {
                    wallet: "Wallet A",
                  },
                })
              }
              className="group w-full flex items-center gap-4 text-left hover:bg-slate-800/40 rounded-lg p-3 transition"
            >
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertTriangle
                  size={18}
                  className="text-red-400"
                />
              </div>

              <div className="flex-1">
                <p className="text-sm">
                  Suspicious activity detected
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Wallet A risk score increased
                </p>
              </div>

              <span className="text-xs text-gray-600 group-hover:text-red-400">
                32 min
              </span>
            </button>
          </div>
        </div>

        {/* RECENT ALERTS */}
        <div className="bg-[#0d1322] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle
                size={20}
                className="text-red-400"
              />

              <h2 className="font-semibold">
                Recent Alerts
              </h2>
            </div>

            <button
              onClick={() => navigate("/alerts")}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition"
            >
              View all →
            </button>
          </div>

          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <button
                key={alert.title}
                onClick={() =>
                  openRecentAlert(
                    alert.entity,
                    alert.title
                  )
                }
                className="group w-full flex items-center gap-3 p-3 rounded-lg bg-[#080d18] border border-gray-800 hover:border-cyan-500/30 hover:bg-[#0b1220] transition text-left"
              >
                <div
                  className={`w-1.5 h-10 rounded-full ${
                    alert.severity === "CRITICAL"
                      ? "bg-red-500"
                      : alert.severity === "HIGH"
                      ? "bg-orange-500"
                      : "bg-yellow-500"
                  }`}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">
                      {alert.title}
                    </p>

                    <span
                      className={`hidden sm:inline-flex text-[9px] px-1.5 py-0.5 rounded border ${getAlertSeverityClass(
                        alert.severity
                      )}`}
                    >
                      {alert.severity}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    {alert.entity} • {alert.time}
                  </p>
                </div>

                <ArrowRight
                  size={14}
                  className="text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs text-gray-600">
        <span>
          NEXUS-CRIME AI • Criminal Network Intelligence
        </span>

        <span>
          Frontend Demo • Mock Intelligence Data
        </span>
      </div>
    </div>
  );
}