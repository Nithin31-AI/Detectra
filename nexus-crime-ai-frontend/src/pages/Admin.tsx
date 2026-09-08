import { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  Plus,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  X,
  RefreshCw,
  Loader2,
  User,
  ClipboardCheck,
  ChevronDown,
  CheckCheck,
} from "lucide-react";
import {
  createAdminCase,
  getMonitoringCases,
  approveCase,
  type CaseMonitorItem,
  type CreateAdminCasePayload,
  type Priority,
  type CaseStatus,
} from "../api/admin";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusBadge(status: CaseStatus) {
  const map: Record<CaseStatus, string> = {
    Active: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    Investigating: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Closed: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };
  return map[status] ?? "bg-slate-500/10 text-slate-400 border-slate-500/20";
}

function priorityBadge(p: Priority) {
  const map: Record<Priority, string> = {
    CRITICAL: "text-red-400 bg-red-500/10 border-red-500/20",
    HIGH: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    MEDIUM: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    LOW: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  };
  return map[p] ?? "text-slate-400";
}

function jobDot(job: string) {
  if (job === "processing")
    return <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />;
  if (job === "complete")
    return <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />;
  return <span className="inline-block w-2 h-2 rounded-full bg-slate-600" />;
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

// ─── Toast ─────────────────────────────────────────────────────────────────────

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: number) => void }) {
  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm pointer-events-auto shadow-2xl
            ${t.type === "success" ? "bg-emerald-950 border-emerald-500/30 text-emerald-300" : ""}
            ${t.type === "error" ? "bg-red-950 border-red-500/30 text-red-300" : ""}
            ${t.type === "info" ? "bg-cyan-950 border-cyan-500/30 text-cyan-300" : ""}
          `}
        >
          {t.type === "success" && <CheckCircle2 size={16} />}
          {t.type === "error" && <AlertTriangle size={16} />}
          {t.type === "info" && <Activity size={16} />}
          <span>{t.message}</span>
          <button
            onClick={() => dismiss(t.id)}
            className="ml-2 opacity-60 hover:opacity-100 transition"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Create Case Modal ─────────────────────────────────────────────────────────

interface CreateCaseModalProps {
  onClose: () => void;
  onCreated: () => void;
  toast: (msg: string, type?: ToastType) => void;
}

function CreateCaseModal({ onClose, onCreated, toast }: CreateCaseModalProps) {
  const [form, setForm] = useState<CreateAdminCasePayload>({
    title: "",
    description: "",
    priority: "MEDIUM",
    assigned_to: null,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast("Title and description are required.", "error");
      return;
    }
    setLoading(true);
    try {
      const payload: CreateAdminCasePayload = {
        ...form,
        assigned_to: form.assigned_to?.trim() || null,
      };
      const created = await createAdminCase(payload);
      toast(`Case ${created.id} created successfully.`, "success");
      onCreated();
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        "Failed to create case. Check your admin token.";
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-[#0d1322] border border-cyan-500/20 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Plus size={18} className="text-cyan-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">New Investigation Case</h2>
              <p className="text-xs text-slate-500">Admin — Case Creation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">
              Case Title <span className="text-red-400">*</span>
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Operation Dark Web"
              maxLength={200}
              className="w-full bg-[#080d18] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 transition"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief overview of the investigation..."
              rows={4}
              maxLength={10000}
              className="w-full bg-[#080d18] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 transition resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">
                Priority
              </label>
              <div className="relative">
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value as Priority })
                  }
                  className="w-full appearance-none bg-[#080d18] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 transition"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">
                Assign Investigator
              </label>
              <div className="relative">
                <User
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  value={form.assigned_to ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, assigned_to: e.target.value || null })
                  }
                  placeholder="investigator ID"
                  className="w-full bg-[#080d18] border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 transition"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-slate-700 text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 text-slate-950 text-sm font-semibold hover:bg-cyan-400 transition disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Plus size={15} />
              )}
              {loading ? "Creating..." : "Create Case"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Approve Modal ─────────────────────────────────────────────────────────────

interface ApproveModalProps {
  caseItem: CaseMonitorItem;
  onClose: () => void;
  onApproved: () => void;
  toast: (msg: string, type?: ToastType) => void;
}

function ApproveModal({ caseItem, onClose, onApproved, toast }: ApproveModalProps) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await approveCase(caseItem.id, notes.trim() || null);
      toast(`Case ${caseItem.id} approved and signed off.`, "success");
      onApproved();
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        "Approval failed. Check your admin token.";
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-[#0d1322] border border-emerald-500/20 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <ClipboardCheck size={18} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Approve Investigation Report</h2>
              <p className="text-xs text-slate-500 font-mono">{caseItem.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 rounded-lg bg-[#080d18] border border-slate-800">
            <p className="text-sm font-medium text-white">{caseItem.title}</p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`text-[10px] px-2 py-0.5 rounded border ${statusBadge(caseItem.status)}`}
              >
                {caseItem.status}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded border ${priorityBadge(caseItem.priority)}`}
              >
                {caseItem.priority}
              </span>
              <span className="text-xs text-slate-500 ml-auto">
                {caseItem.evidence_count} evidence item{caseItem.evidence_count !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">
              Sign-off Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes or observations for this approval..."
              rows={4}
              maxLength={5000}
              className="w-full bg-[#080d18] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-emerald-500/50 transition resize-none"
            />
          </div>

          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/15">
            <p className="text-xs text-amber-400">
              ⚠ This action will mark the case as <strong>Approved</strong> and timestamp your
              admin sign-off. This cannot be undone automatically.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-slate-700 text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleApprove}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 text-slate-950 text-sm font-semibold hover:bg-emerald-400 transition disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <CheckCheck size={15} />
              )}
              {loading ? "Approving..." : "Approve & Sign Off"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Monitoring Table ──────────────────────────────────────────────────────────

interface MonitoringPanelProps {
  cases: CaseMonitorItem[];
  loading: boolean;
  onRefresh: () => void;
  onApprove: (c: CaseMonitorItem) => void;
}

function MonitoringPanel({ cases, loading, onRefresh, onApprove }: MonitoringPanelProps) {
  const approvable = cases.filter(
    (c) => c.status === "Active" || c.status === "Investigating"
  );

  const stats = {
    total: cases.length,
    active: cases.filter((c) => c.status === "Active").length,
    investigating: cases.filter((c) => c.status === "Investigating").length,
    approved: cases.filter((c) => c.status === "Approved").length,
    processing: cases.filter((c) => c.job_status === "processing").length,
  };

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Total Cases", value: stats.total, color: "text-white" },
          { label: "Active", value: stats.active, color: "text-cyan-400" },
          { label: "Investigating", value: stats.investigating, color: "text-orange-400" },
          { label: "Approved", value: stats.approved, color: "text-emerald-400" },
          { label: "Processing Jobs", value: stats.processing, color: "text-amber-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[#080d18] border border-slate-800 rounded-xl p-4"
          >
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-2 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Approval Needed */}
      {approvable.length > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle size={16} className="text-amber-400 shrink-0" />
          <p className="text-sm text-amber-300">
            <strong>{approvable.length}</strong> case
            {approvable.length !== 1 ? "s" : ""} pending approval sign-off.
          </p>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity size={17} className="text-cyan-400" />
            <h3 className="font-semibold text-sm">Investigation Progress Monitor</h3>
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 transition disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {loading && cases.length === 0 ? (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-500">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Loading monitoring data…</span>
          </div>
        ) : cases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-600">
            <FileText size={32} className="mb-3" />
            <p className="text-sm">No cases found.</p>
            <p className="text-xs mt-1">Create your first case using the button above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Case</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Priority</th>
                  <th className="text-left px-4 py-3">Evidence</th>
                  <th className="text-left px-4 py-3">Assigned To</th>
                  <th className="text-left px-4 py-3">Job</th>
                  <th className="text-left px-4 py-3">Updated</th>
                  <th className="text-left px-4 py-3">Approved By</th>
                  <th className="text-left px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-slate-800/50 hover:bg-slate-800/20 transition"
                  >
                    <td className="px-5 py-4">
                      <p className="font-mono text-xs text-slate-400">{c.id}</p>
                      <p className="font-medium text-white max-w-[180px] truncate">{c.title}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-[10px] px-2 py-1 rounded border ${statusBadge(c.status)}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-[10px] px-2 py-1 rounded border ${priorityBadge(c.priority)}`}
                      >
                        {c.priority}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <FileText size={13} className="text-slate-500" />
                        {c.evidence_count}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-400 text-xs">
                      {c.assigned_to ?? <span className="text-slate-600">Unassigned</span>}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {jobDot(c.job_status)}
                        <span className="text-xs text-slate-400 capitalize">{c.job_status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {fmtDate(c.updated_at)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      {c.approved_by ? (
                        <div>
                          <p className="text-emerald-400">{c.approved_by}</p>
                          <p className="text-slate-600">{fmtDate(c.approved_at)}</p>
                        </div>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {(c.status === "Active" || c.status === "Investigating") && (
                        <button
                          onClick={() => onApprove(c)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs hover:bg-emerald-500/20 transition whitespace-nowrap"
                        >
                          <ClipboardCheck size={12} />
                          Approve
                        </button>
                      )}
                      {c.status === "Approved" && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                          <CheckCircle2 size={13} />
                          Signed off
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Admin Page ─────────────────────────────────────────────────────────────────

export default function Admin() {
  const [cases, setCases] = useState<CaseMonitorItem[]>([]);
  const [monitorLoading, setMonitorLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [approveTarget, setApproveTarget] = useState<CaseMonitorItem | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const toast = (message: string, type: ToastType = "info") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  };

  const dismissToast = (id: number) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const fetchMonitoring = async () => {
    setMonitorLoading(true);
    try {
      const data = await getMonitoringCases();
      setCases(data);
    } catch {
      toast("Failed to load monitoring data. Is the backend running?", "error");
    } finally {
      setMonitorLoading(false);
    }
  };

  // Initial load + auto-refresh every 30s
  useEffect(() => {
    fetchMonitoring();
    const interval = setInterval(fetchMonitoring, 30_000);
    return () => clearInterval(interval);
  }, []);

  const pendingApproval = cases.filter(
    (c) => c.status === "Active" || c.status === "Investigating"
  ).length;

  return (
    <>
      <ToastContainer toasts={toasts} dismiss={dismissToast} />

      {showCreateModal && (
        <CreateCaseModal
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchMonitoring}
          toast={toast}
        />
      )}

      {approveTarget && (
        <ApproveModal
          caseItem={approveTarget}
          onClose={() => setApproveTarget(null)}
          onApproved={fetchMonitoring}
          toast={toast}
        />
      )}

      <div className="min-h-screen bg-[#070b14] text-white p-4 sm:p-6 lg:p-8">
        {/* ── Page Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/15 flex items-center justify-center">
                <ShieldCheck size={18} className="text-cyan-400" />
              </div>
              <span className="text-xs text-cyan-400 uppercase tracking-widest">
                Admin Control Panel
              </span>
              {pendingApproval > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  {pendingApproval} pending approval
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Admin Dashboard
            </h1>

            <p className="text-sm md:text-base text-slate-400 mt-2 max-w-2xl">
              Create and manage investigation cases, monitor active processing jobs, and approve
              completed investigation reports.
            </p>
          </div>

          <button
            id="admin-create-case-btn"
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20"
          >
            <Plus size={18} />
            Create New Case
          </button>
        </div>

        {/* ── Info Cards Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#0d1322] border border-cyan-500/10 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Plus size={16} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Case Creation</p>
                <p className="text-sm font-medium text-white">Admin Only</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-5">
              Create new investigation cases with title, description, priority, and optional
              investigator assignment.
            </p>
          </div>

          <div className="bg-[#0d1322] border border-amber-500/10 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Activity size={16} className="text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Process Monitoring
                </p>
                <p className="text-sm font-medium text-white">Auto-refresh 30s</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-5">
              Live dashboard of all active investigations — evidence count, processing jobs, and
              assignment status.
            </p>
          </div>

          <div className="bg-[#0d1322] border border-emerald-500/10 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <ClipboardCheck size={16} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Report Approval
                </p>
                <p className="text-sm font-medium text-white">Sign-off & Close</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-5">
              Review completed investigation reports, add sign-off notes, and approve cases for
              official closure.
            </p>
          </div>
        </div>

        {/* ── Monitoring & Approval Panel ── */}
        <MonitoringPanel
          cases={cases}
          loading={monitorLoading}
          onRefresh={fetchMonitoring}
          onApprove={(c) => setApproveTarget(c)}
        />

        {/* ── Footer ── */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <span>DETECTRA • Admin Control Panel</span>
          <span>JWT-authenticated • Admin role required for all operations</span>
        </div>
      </div>
    </>
  );
}
