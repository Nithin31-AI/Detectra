import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  FolderOpen,
  User,
  Wallet,
  Network,
  Bot,
  AlertTriangle,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2,
  Activity,
  X,
} from "lucide-react";

type CaseStatus = "Active" | "Investigating" | "Closed";

type CaseItem = {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  priority: "Critical" | "High" | "Medium";
  suspects: number;
  entities: number;
  wallets: number;
  updated: string;
};

const cases: CaseItem[] = [
  {
    id: "CASE-001",
    title: "Operation Dark Web",
    description:
      "Investigation into a suspected criminal network involving multiple high-risk entities.",
    status: "Active",
    priority: "Critical",
    suspects: 4,
    entities: 18,
    wallets: 7,
    updated: "10 min ago",
  },
  {
    id: "CASE-002",
    title: "Crypto Laundering Network",
    description:
      "Suspicious cryptocurrency transfers detected across interconnected wallets.",
    status: "Investigating",
    priority: "High",
    suspects: 3,
    entities: 12,
    wallets: 9,
    updated: "32 min ago",
  },
  {
    id: "CASE-003",
    title: "Synthetic Identity Ring",
    description:
      "Multiple identities connected through common devices and communication patterns.",
    status: "Investigating",
    priority: "High",
    suspects: 6,
    entities: 21,
    wallets: 4,
    updated: "1 hour ago",
  },
  {
    id: "CASE-004",
    title: "Illegal Payment Network",
    description:
      "Analysis of suspicious payment relationships between known entities.",
    status: "Active",
    priority: "Medium",
    suspects: 2,
    entities: 9,
    wallets: 5,
    updated: "3 hours ago",
  },
  {
    id: "CASE-005",
    title: "Dark Market Investigation",
    description:
      "Previously investigated criminal marketplace network.",
    status: "Closed",
    priority: "Medium",
    suspects: 5,
    entities: 14,
    wallets: 6,
    updated: "Yesterday",
  },
];

function statusClass(status: CaseStatus) {
  if (status === "Active") {
    return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
  }

  if (status === "Investigating") {
    return "bg-orange-500/10 text-orange-400 border-orange-500/20";
  }

  return "bg-green-500/10 text-green-400 border-green-500/20";
}

function priorityClass(priority: CaseItem["priority"]) {
  if (priority === "Critical") {
    return "text-red-400 bg-red-500/10 border-red-500/20";
  }

  if (priority === "High") {
    return "text-orange-400 bg-orange-500/10 border-orange-500/20";
  }

  return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
}

export default function Cases() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      const searchText = search.toLowerCase();

      const searchMatch =
        item.title.toLowerCase().includes(searchText) ||
        item.id.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText);

      const statusMatch =
        statusFilter === "All" || item.status === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [search, statusFilter]);

  const openCase = (item: CaseItem) => {
    navigate("/case-details", {
      state: {
        caseId: item.id,
      },
    });
  };

  const openAI = (item: CaseItem) => {
    navigate("/ai", {
      state: {
        entity:
          item.id === "CASE-001"
            ? "Person A"
            : "Person B",
      },
    });
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  const totalCases = cases.length;

  const activeCases = cases.filter(
    (item) => item.status === "Active"
  ).length;

  const investigatingCases = cases.filter(
    (item) => item.status === "Investigating"
  ).length;

  const closedCases = cases.filter(
    (item) => item.status === "Closed"
  ).length;

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <FolderOpen
              className="text-cyan-400 shrink-0"
              size={27}
            />

            <span className="text-xs text-cyan-400 uppercase tracking-widest">
              Investigation Management
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold">
            Investigation Cases
          </h1>

          <p className="text-sm md:text-base text-gray-400 mt-2 max-w-2xl">
            Manage criminal investigations, suspects, evidence and intelligence.
          </p>
        </div>

        <button
          onClick={() => {
            alert("New Case creation will be connected to the backend.");
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition"
        >
          <Plus size={18} />
          New Case
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <button
          onClick={() => setStatusFilter("All")}
          className="text-left bg-[#0d1322] border border-gray-800 rounded-xl p-4 sm:p-5 hover:border-cyan-500/30 transition"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm text-gray-400">
              Total Cases
            </span>

            <FolderOpen
              size={19}
              className="text-cyan-400 shrink-0"
            />
          </div>

          <p className="text-2xl sm:text-3xl font-bold mt-4">
            {totalCases}
          </p>

          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
            All investigations
          </p>
        </button>

        <button
          onClick={() => setStatusFilter("Active")}
          className="text-left bg-[#0d1322] border border-gray-800 rounded-xl p-4 sm:p-5 hover:border-cyan-500/30 transition"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm text-gray-400">
              Active
            </span>

            <Activity
              size={19}
              className="text-cyan-400 shrink-0"
            />
          </div>

          <p className="text-2xl sm:text-3xl font-bold text-cyan-400 mt-4">
            {activeCases}
          </p>

          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
            Currently active
          </p>
        </button>

        <button
          onClick={() => setStatusFilter("Investigating")}
          className="text-left bg-[#0d1322] border border-gray-800 rounded-xl p-4 sm:p-5 hover:border-gray-700 transition"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm text-gray-400">
              Investigating
            </span>

            <AlertTriangle
              size={19}
              className="text-orange-400 shrink-0"
            />
          </div>

          <p className="text-2xl sm:text-3xl font-bold text-orange-400 mt-4">
            {investigatingCases}
          </p>

          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
            Under investigation
          </p>
        </button>

        <button
          onClick={() => setStatusFilter("Closed")}
          className="text-left bg-[#0d1322] border border-gray-800 rounded-xl p-4 sm:p-5 hover:border-green-500/30 transition"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm text-gray-400">
              Closed
            </span>

            <CheckCircle2
              size={19}
              className="text-green-400 shrink-0"
            />
          </div>

          <p className="text-2xl sm:text-3xl font-bold text-green-400 mt-4">
            {closedCases}
          </p>

          <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
            Completed cases
          </p>
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-[#0d1322] border border-gray-800 rounded-xl p-3 sm:p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search case ID, title or description..."
              className="w-full bg-[#080d18] border border-gray-800 rounded-lg pl-10 pr-10 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-cyan-500/40"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-48 bg-[#080d18] border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300 outline-none"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Investigating">Investigating</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {(search || statusFilter !== "All") && (
          <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-gray-800">
            <p className="text-xs text-gray-500">
              {filteredCases.length} case
              {filteredCases.length !== 1 ? "s" : ""} found
            </p>

            <button
              onClick={clearFilters}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* CASE LIST */}
      <div className="space-y-4">
        {filteredCases.map((item) => (
          <div
            key={item.id}
            className="bg-[#0d1322] border border-gray-800 rounded-xl p-4 sm:p-6 hover:border-cyan-500/30 transition"
          >
            <div className="flex flex-col gap-5">
              {/* CASE INFO */}
              <div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                  <span className="text-xs text-gray-500 font-mono">
                    {item.id}
                  </span>

                  <span
                    className={`text-[9px] sm:text-[10px] uppercase tracking-wider px-2 py-1 rounded border ${statusClass(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>

                  <span
                    className={`text-[9px] sm:text-[10px] uppercase tracking-wider px-2 py-1 rounded border ${priorityClass(
                      item.priority
                    )}`}
                  >
                    {item.priority} Priority
                  </span>
                </div>

                <h2 className="text-lg font-semibold">
                  {item.title}
                </h2>

                <p className="text-sm text-gray-500 mt-2 max-w-3xl leading-6">
                  {item.description}
                </p>

                {/* CASE METRICS */}
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-5 mt-5">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <User
                      size={15}
                      className="text-cyan-400"
                    />
                    {item.suspects} Suspects
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Network
                      size={15}
                      className="text-violet-400"
                    />
                    {item.entities} Entities
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Wallet
                      size={15}
                      className="text-green-400"
                    />
                    {item.wallets} Wallets
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={15} />
                    Updated {item.updated}
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:max-w-md">
                <button
                  onClick={() => openCase(item)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm hover:bg-cyan-500/20 transition"
                >
                  Open Investigation
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => openAI(item)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-800 text-gray-400 text-sm hover:text-white hover:bg-gray-800/50 transition"
                >
                  <Bot size={16} />
                  AI Analysis
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* EMPTY STATE */}
        {filteredCases.length === 0 && (
          <div className="border border-dashed border-gray-800 rounded-xl p-10 sm:p-12 text-center">
            <FolderOpen
              size={35}
              className="mx-auto text-gray-700 mb-3"
            />

            <p className="text-sm text-gray-500">
              No investigation cases found.
            </p>

            <button
              onClick={clearFilters}
              className="mt-4 text-xs text-cyan-400 hover:text-cyan-300"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs text-gray-600">
        <span>
          NEXUS-CRIME AI • Investigation Management
        </span>

        <span>
          Frontend Demo • Mock Case Data
        </span>
      </div>
    </div>
  );
}