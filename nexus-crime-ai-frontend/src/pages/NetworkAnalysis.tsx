import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import cytoscape from "cytoscape";
import {
  Search,
  User,
  Wallet,
  Smartphone,
  Network,
  Bot,
  Link2,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";

type EntityType = "Person" | "Wallet" | "Device";

type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

interface Entity {
  id: string;
  label: string;
  type: EntityType;
  risk: RiskLevel;
  connections: number;
  cases: number;
}

const entities: Entity[] = [
  {
    id: "person1",
    label: "Person A",
    type: "Person",
    risk: "HIGH",
    connections: 5,
    cases: 3,
  },
  {
    id: "person2",
    label: "Person B",
    type: "Person",
    risk: "MEDIUM",
    connections: 3,
    cases: 2,
  },
  {
    id: "wallet1",
    label: "Wallet A",
    type: "Wallet",
    risk: "HIGH",
    connections: 4,
    cases: 2,
  },
  {
    id: "wallet2",
    label: "Wallet B",
    type: "Wallet",
    risk: "MEDIUM",
    connections: 2,
    cases: 1,
  },
  {
    id: "device1",
    label: "Device A",
    type: "Device",
    risk: "LOW",
    connections: 2,
    cases: 1,
  },
];

const edges = [
  {
    data: {
      id: "e1",
      source: "person1",
      target: "wallet1",
    },
  },
  {
    data: {
      id: "e2",
      source: "person1",
      target: "person2",
    },
  },
  {
    data: {
      id: "e3",
      source: "person2",
      target: "wallet2",
    },
  },
  {
    data: {
      id: "e4",
      source: "person1",
      target: "device1",
    },
  },
];

function NetworkAnalysis() {
  const location = useLocation();

  const graphRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | EntityType>("All");

  const [selectedEntity, setSelectedEntity] =
    useState<Entity | null>(null);

  const [highlightedConnections, setHighlightedConnections] =
    useState<string[]>([]);

  const caseId = location.state?.caseId || null;
  const caseTitle = location.state?.caseTitle || null;

  const filteredEntities = entities.filter((entity) => {
    const matchesSearch = entity.label
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || entity.type === filter;

    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    if (!graphRef.current) return;

    const nodes = entities.map((entity) => ({
      data: {
        id: entity.id,
        label: entity.label,
        type: entity.type,
        risk: entity.risk,
      },
    }));

    const cy = cytoscape({
      container: graphRef.current,

      elements: [
        ...nodes,
        ...edges,
      ],

      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            color: "#e2e8f0",
            "background-color": "#0e7490",
            "border-width": 2,
            "border-color": "#22d3ee",
            width: 55,
            height: 55,
            "font-size": 11,
            "text-valign": "bottom",
            "text-margin-y": 8,
          },
        },

        {
          selector: 'node[type="Person"]',
          style: {
            shape: "ellipse",
            "background-color": "#7c3aed",
            "border-color": "#a78bfa",
          },
        },

        {
          selector: 'node[type="Wallet"]',
          style: {
            shape: "round-rectangle",
            "background-color": "#0369a1",
            "border-color": "#38bdf8",
          },
        },

        {
          selector: 'node[type="Device"]',
          style: {
            shape: "hexagon",
            "background-color": "#475569",
            "border-color": "#94a3b8",
          },
        },

        {
          selector: 'node[risk="HIGH"]',
          style: {
            "border-color": "#ef4444",
            "border-width": 4,
          },
        },

        {
          selector: 'node[risk="MEDIUM"]',
          style: {
            "border-color": "#f59e0b",
            "border-width": 3,
          },
        },

        {
          selector: "edge",
          style: {
            width: 2,
            "line-color": "#475569",
            "target-arrow-color": "#64748b",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
          },
        },

        {
          selector: ".selected-node",
          style: {
            "border-color": "#22d3ee",
            "border-width": 6,
            "overlay-color": "#22d3ee",
            "overlay-opacity": 0.18,
            "overlay-padding": 8,
          },
        },

        {
          selector: ".highlighted-node",
          style: {
            "border-color": "#f8fafc",
            "border-width": 5,
            "overlay-color": "#f8fafc",
            "overlay-opacity": 0.12,
            "overlay-padding": 6,
          },
        },

        {
          selector: ".highlighted-edge",
          style: {
            width: 4,
            "line-color": "#22d3ee",
            "target-arrow-color": "#22d3ee",
            "z-index": 10,
          },
        },
      ],

      layout: {
        name: "cose",
        animate: true,
      },
    });

    cy.on("tap", "node", (event) => {
      const node = event.target;
      const id = node.id();

      const entity = entities.find(
        (item) => item.id === id
      );

      if (entity) {
        const connectedIds = node
          .connectedEdges()
          .connectedNodes()
          .filter((connectedNode: any) => connectedNode.id() !== id)
          .map((connectedNode: any) => connectedNode.id());

        setSelectedEntity(entity);
        setHighlightedConnections(connectedIds);

        cy.elements().removeClass("selected-node highlighted-node highlighted-edge");
        node.addClass("selected-node");

        node
          .connectedNodes()
          .not(node)
          .addClass("highlighted-node");

        node
          .connectedEdges()
          .addClass("highlighted-edge");
      }
    });

    cy.on("tap", (event) => {
      if (event.target === cy) {
        setSelectedEntity(null);
        setHighlightedConnections([]);
        cy.elements().removeClass(
          "selected-node highlighted-node highlighted-edge"
        );
      }
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, []);

  useEffect(() => {
    if (!cyRef.current) return;

    cyRef.current.nodes().forEach((node) => {
      const id = node.id();

      const visible = filteredEntities.some(
        (entity) => entity.id === id
      );

      node.style(
        "display",
        visible ? "element" : "none"
      );
    });
  }, [search, filter, filteredEntities]);

  const getIcon = (type: EntityType) => {
    if (type === "Person") {
      return <User size={18} />;
    }

    if (type === "Wallet") {
      return <Wallet size={18} />;
    }

    return <Smartphone size={18} />;
  };

  const getRiskClass = (risk: RiskLevel) => {
    if (risk === "HIGH") {
      return "text-red-400 bg-red-500/10 border-red-500/20";
    }

    if (risk === "MEDIUM") {
      return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    }

    return "text-green-400 bg-green-500/10 border-green-500/20";
  };

  return (
    <div className="min-h-screen bg-slate-950">

      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-900 px-8 py-5">

        <div className="flex items-center justify-between">

          <div>
            <div className="flex items-center gap-3">

              <Network
                size={24}
                className="text-cyan-400"
              />

              <h1 className="text-xl font-bold">
                Network Analysis
              </h1>

            </div>

            <p className="text-sm text-slate-500 mt-1">
              Criminal entity relationship visualization
            </p>
          </div>

          <div className="text-xs text-green-400">
            ● LIVE INVESTIGATION
          </div>

        </div>

      </header>

      <div className="p-8">

        {/* CASE CONTEXT */}
        {caseId && (
          <div className="mb-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">

            <div className="flex items-center justify-between">

              <div>

                <div className="flex items-center gap-2 mb-2">

                  <ShieldAlert
                    size={18}
                    className="text-cyan-400"
                  />

                  <span className="text-xs uppercase tracking-wider text-cyan-400">
                    Active Case Investigation
                  </span>

                </div>

                <h2 className="text-lg font-semibold text-white">
                  {caseTitle}
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Case ID: {caseId}
                </p>

              </div>

              <Link
                to="/cases"
                className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
              >
                <ArrowLeft size={16} />
                Back to Cases
              </Link>

            </div>

          </div>
        )}

        {/* SEARCH + FILTER */}
        <div className="flex items-center gap-4 mb-6">

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search entities..."
              className="w-full rounded-lg border border-slate-800 bg-slate-900 py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-cyan-500/50"
            />

          </div>

          <div className="flex gap-2">

            {(
              ["All", "Person", "Wallet", "Device"] as const
            ).map((item) => (

              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`rounded-lg px-4 py-3 text-sm transition ${
                  filter === item
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    : "border border-slate-800 text-slate-400 hover:bg-slate-900"
                }`}
              >
                {item}
              </button>

            ))}

          </div>

        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* GRAPH */}
          <div className="xl:col-span-2 rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">

            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

              <div>

                <h2 className="font-semibold">
                  Criminal Network
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  {filteredEntities.length} entities visible
                </p>

              </div>

              <div className="flex items-center gap-4 text-xs">

                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  High
                </span>

                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-400" />
                  Medium
                </span>

                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Low
                </span>

              </div>

            </div>

            <div
              ref={graphRef}
              className="h-[560px] w-full"
            />

          </div>

          {/* ENTITY PANEL */}
          <div className="rounded-xl border border-slate-800 bg-slate-900">

            <div className="border-b border-slate-800 px-5 py-4">

              <h2 className="font-semibold">
                Entity Details
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Select a node to investigate
              </p>

            </div>

            {selectedEntity ? (

              <div className="p-5">

                <div className="flex items-center gap-3 mb-6">

                  <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400">
                    {getIcon(selectedEntity.type)}
                  </div>

                  <div>

                    <h3 className="font-semibold">
                      {selectedEntity.label}
                    </h3>

                    <p className="text-xs text-slate-500">
                      {selectedEntity.type}
                    </p>

                  </div>

                </div>

                <div className="space-y-4">

                  <div className="flex items-center justify-between">

                    <span className="text-sm text-slate-500">
                      Risk Level
                    </span>

                    <span
                      className={`rounded-md border px-2 py-1 text-xs ${getRiskClass(
                        selectedEntity.risk
                      )}`}
                    >
                      {selectedEntity.risk}
                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <span className="text-sm text-slate-500">
                      Connections
                    </span>

                    <span className="text-sm text-white">
                      {selectedEntity.connections}
                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <span className="text-sm text-slate-500">
                      Related Cases
                    </span>

                    <span className="text-sm text-white">
                      {selectedEntity.cases}
                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <span className="text-sm text-slate-500">
                      Direct Links
                    </span>

                    <span className="text-sm text-cyan-400">
                      {highlightedConnections.length}
                    </span>

                  </div>

                </div>

                {highlightedConnections.length > 0 && (
                  <div className="mt-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">

                    <div className="flex items-center gap-2 mb-3">
                      <Link2 size={16} className="text-cyan-400" />
                      <span className="text-xs uppercase tracking-wider text-cyan-400">
                        Direct Relationships
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {highlightedConnections.map((id) => {
                        const connected = entities.find(
                          (item) => item.id === id
                        );

                        return (
                          <span
                            key={id}
                            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300"
                          >
                            {connected?.label || id}
                          </span>
                        );
                      })}
                    </div>

                  </div>
                )}

                <div className="mt-8 space-y-3">

                  {selectedEntity.type === "Person" && (
                    <Link
                      to="/ai"
                      state={{
                        entity: selectedEntity.label,
                      }}
                      className="flex items-center justify-center gap-2 w-full rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 py-3 text-sm hover:bg-violet-500/20"
                    >
                      <Bot size={17} />
                      Investigate with AI
                    </Link>
                  )}

                  {selectedEntity.type === "Wallet" && (
                    <Link
                      to="/blockchain"
                      state={{
                        wallet: selectedEntity.label,
                      }}
                      className="flex items-center justify-center gap-2 w-full rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 py-3 text-sm hover:bg-cyan-500/20"
                    >
                      <Link2 size={17} />
                      Investigate Wallet
                    </Link>
                  )}

                  {selectedEntity.type === "Device" && (
                    <button
                      className="flex items-center justify-center gap-2 w-full rounded-lg bg-slate-800 text-slate-300 py-3 text-sm"
                    >
                      <Smartphone size={17} />
                      Device Analysis
                    </button>
                  )}

                </div>

              </div>

            ) : (

              <div className="p-8 text-center">

                <Network
                  size={35}
                  className="mx-auto text-slate-700 mb-4"
                />

                <p className="text-sm text-slate-400">
                  Select an entity from the network
                </p>

                <p className="text-xs text-slate-600 mt-2">
                  Click any node to view investigation details
                </p>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default NetworkAnalysis;