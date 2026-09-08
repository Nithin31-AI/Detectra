import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, UserCheck, AlertCircle, ArrowRight, Lock, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, loginDemo, user } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      navigate("/admin");
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Authentication failed. Check your username and password."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: "admin" | "investigator") => {
    setError(null);
    setLoading(true);
    try {
      await loginDemo(role);
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/cases");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Authentication failed. Could not log in."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full">
        {/* BRAND HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-4 shadow-lg shadow-cyan-500/10">
            <img
              src="/favicon.png"
              alt="DETECTRA Emblem"
              className="w-14 h-14 object-contain"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            DETECT<span className="text-cyan-400">RA</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-400 mt-1 font-mono">
            Law Enforcement AI Investigation Platform
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur shadow-2xl">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">System Authentication</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter your officer credentials or select a quick-access role
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {user && (
            <div className="mb-5 p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs">
              <span className="text-slate-400">Currently signed in:</span>
              <span className="font-semibold text-cyan-400">{user.username} ({user.role})</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Username / Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@system.local"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition cursor-pointer"
            >
              {loading ? "Authenticating..." : "Sign In with Credentials"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* QUICK DEMO LOGINS */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-slate-500 font-mono">
                Or Quick-Access Roles
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin("admin")}
              className="p-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-left transition flex flex-col justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400">Admin</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Full supervisory control & approvals
              </p>
              <span className="text-[10px] text-emerald-400/80 font-mono mt-2 group-hover:underline">
                admin@system.local &rarr;
              </span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin("investigator")}
              className="p-3.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-left transition flex flex-col justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-blue-400">Investigator</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Standard case management & analysis
              </p>
              <span className="text-[10px] text-blue-400/80 font-mono mt-2 group-hover:underline">
                investigator@example.com &rarr;
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
