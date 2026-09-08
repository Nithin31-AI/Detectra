import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import { useState } from "react";

import {
  LayoutDashboard,
  Network,
  Link2,
  Bot,
  Bell,
  ShieldCheck,
  FolderOpen,
  Menu,
  X,
  LogIn,
  LogOut,
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import CaseDetails from "./pages/CaseDetails";
import NetworkAnalysis from "./pages/NetworkAnalysis";
import Blockchain from "./pages/Blockchain";
import AIAssistant from "./pages/AIAssistant";
import Alerts from "./pages/Alerts";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
}) {
  const location = useLocation();
  const { user, logout, loginDemo } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Cases",
      path: "/cases",
      icon: FolderOpen,
    },
    {
      name: "Network Analysis",
      path: "/network",
      icon: Network,
    },
    {
      name: "Blockchain",
      path: "/blockchain",
      icon: Link2,
    },
    {
      name: "AI Assistant",
      path: "/ai",
      icon: Bot,
    },
    {
      name: "Alerts",
      path: "/alerts",
      icon: Bell,
    },
  ];

  const adminItems = [
    {
      name: "Admin Panel",
      path: "/admin",
      icon: ShieldCheck,
    },
  ];

  const handleNavigation = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:sticky
          top-0 left-0
          z-50
          w-72 lg:w-64
          h-screen
          border-r border-slate-800
          bg-slate-900
          flex flex-col
          transition-transform duration-300
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* HEADER */}
        <div className="p-5 sm:p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              onClick={handleNavigation}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                <img
                  src="/favicon.png"
                  alt="DETECTRA Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>

              <div>
                <h1 className="text-lg font-bold text-cyan-400">
                  DETECTRA
                </h1>

                <p className="text-[10px] text-slate-500">
                  AI INVESTIGATION PLATFORM
                </p>
              </div>
            </Link>

            {/* MOBILE CLOSE */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest px-3 mb-3">
            Investigation
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavigation}
                className={`
                  flex items-center gap-3
                  rounded-lg
                  px-4 py-3
                  transition
                  ${
                    active
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/10"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >
                <Icon size={19} />

                <span className="text-sm">
                  {item.name}
                </span>

                {item.name === "Alerts" && (
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">
                    8
                  </span>
                )}
              </Link>
            );
          })}

          {/* ADMIN SECTION */}
          <div className="pt-4">
            <div className="flex items-center justify-between px-3 mb-3">
              <p className="text-[10px] text-slate-600 uppercase tracking-widest">
                Administration
              </p>
              {user?.isAdmin ? (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                  ACTIVE
                </span>
              ) : (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono">
                  RESTRICTED
                </span>
              )}
            </div>

            {adminItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleNavigation}
                  className={`
                    flex items-center gap-3
                    rounded-lg
                    px-4 py-3
                    transition
                    ${
                      active
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }
                  `}
                >
                  <Icon size={19} />

                  <span className="text-sm">
                    {item.name}
                  </span>

                  {!user?.isAdmin && (
                    <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      RBAC
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* USER AUTH BAR */}
        <div className="p-4 border-t border-slate-800/80 space-y-2.5">
          {user ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                  user.isAdmin ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"
                }`}>
                  {user.role}
                </span>
                <button
                  onClick={logout}
                  className="text-slate-500 hover:text-red-400 transition p-1"
                  title="Sign Out"
                >
                  <LogOut size={13} />
                </button>
              </div>
              <p className="text-xs font-mono text-slate-300 truncate" title={user.username}>
                {user.username}
              </p>
              <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                {user.isAdmin ? (
                  <button
                    onClick={() => loginDemo("investigator")}
                    className="text-xs text-blue-400 hover:underline cursor-pointer"
                  >
                    Test as Investigator &rarr;
                  </button>
                ) : (
                  <button
                    onClick={() => loginDemo("admin")}
                    className="text-xs text-emerald-400 hover:underline cursor-pointer"
                  >
                    Switch to Admin &rarr;
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-center">
              <p className="text-xs text-slate-400 mb-2">Not authenticated</p>
              <Link
                to="/login"
                onClick={handleNavigation}
                className="w-full py-1.5 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <LogIn size={13} /> Sign In
              </Link>
            </div>
          )}

          {/* SYSTEM STATUS */}
          <div className="rounded-xl border border-slate-800/60 bg-slate-950/60 px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-slate-400">DETECTRA Core</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">ONLINE</span>
          </div>
        </div>
      </aside>
    </>
  );
}

/* =========================================================
   APP
========================================================= */

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-950 text-white flex">
          {/* SIDEBAR */}
          <Sidebar
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />

          {/* MAIN AREA */}
          <main className="flex-1 min-w-0 w-full">
            {/* MOBILE TOP BAR */}
            <div className="lg:hidden sticky top-0 z-30 h-16 px-4 flex items-center justify-between bg-slate-950/95 backdrop-blur border-b border-slate-800">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/30 transition"
                aria-label="Open navigation"
              >
                <Menu size={21} />
              </button>

              <Link
                to="/"
                className="flex items-center gap-2"
              >
                <img
                  src="/favicon.png"
                  alt="DETECTRA"
                  className="w-6 h-6 object-contain"
                />

                <span className="text-sm font-bold text-cyan-400">
                  DETECTRA
                </span>
              </Link>

              <Link
                to="/alerts"
                className="relative p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
                aria-label="Alerts"
              >
                <Bell size={19} />

                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-[9px] flex items-center justify-center text-white">
                  8
                </span>
              </Link>
            </div>

            {/* ROUTES */}
            <Routes>
              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/cases"
                element={<Cases />}
              />

              {/* REAL CASE DETAILS PAGE */}
              <Route
                path="/case-details"
                element={<CaseDetails />}
              />

              <Route
                path="/network"
                element={<NetworkAnalysis />}
              />

              <Route
                path="/blockchain"
                element={<Blockchain />}
              />

              <Route
                path="/ai"
                element={<AIAssistant />}
              />

              <Route
                path="/alerts"
                element={<Alerts />}
              />

              <Route
                path="/login"
                element={<Login />}
              />

              {/* PROTECTED ADMIN ROUTE */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <Admin />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;