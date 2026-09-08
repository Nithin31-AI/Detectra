import React from "react";
import { Link, Navigate } from "react-router-dom";
import { ShieldAlert, LogIn, ArrowLeft, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { user, token, loginDemo } = useAuth();

  // If not authenticated at all, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // If admin is required, check if user is admin
  if (requireAdmin && !user.isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900/90 border border-red-500/30 rounded-2xl p-8 backdrop-blur shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-9 h-9 text-red-400" />
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold tracking-wider uppercase mb-3">
            Admin Access Required
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Unauthorized Access
          </h2>

          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Your current session is authenticated as{" "}
            <span className="text-cyan-400 font-mono font-semibold">
              {user.username}
            </span>{" "}
            with role{" "}
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs uppercase">
              {user.role}
            </span>
            . Administrative privileges are required to access this dashboard.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => loginDemo("admin")}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all duration-200"
            >
              <ShieldCheck className="w-4 h-4" />
              Elevate Session to Admin
            </button>

            <Link
              to="/login"
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              <LogIn className="w-4 h-4" />
              Sign in with Different Credentials
            </Link>

            <Link
              to="/"
              className="w-full py-2.5 px-4 rounded-xl text-slate-400 hover:text-white font-medium text-sm flex items-center justify-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Investigator Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
