import { apiClient } from "./client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type CaseStatus = "Active" | "Investigating" | "Approved" | "Closed";

export interface CreateAdminCasePayload {
  title: string;
  description: string;
  priority: Priority;
  assigned_to: string | null;
}

export interface ApprovePayload {
  notes: string | null;
}

export interface CaseMonitorItem {
  id: string;
  title: string;
  status: CaseStatus;
  priority: Priority;
  evidence_count: number;
  assigned_to: string | null;
  updated_at: string;
  approved_by: string | null;
  approved_at: string | null;
  job_status: "idle" | "processing" | "complete";
}

export interface CaseDetail {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  priority: Priority;
  suspects: number;
  entities: number;
  wallets: number;
  updated_at: string;
  risk_score: number;
  assigned_to: string | null;
  approved_by: string | null;
  approved_at: string | null;
  sign_off_notes: string | null;
}

// ─── API Functions ─────────────────────────────────────────────────────────────

/**
 * Create a new investigation case (admin only).
 * POST /api/v1/admin/cases/
 */
export async function createAdminCase(payload: CreateAdminCasePayload): Promise<CaseDetail> {
  const response = await apiClient.post<CaseDetail>("/admin/cases/", payload);
  return response.data;
}

/**
 * Get monitoring overview of all investigation cases.
 * GET /api/v1/admin/monitoring/cases
 */
export async function getMonitoringCases(): Promise<CaseMonitorItem[]> {
  const response = await apiClient.get<CaseMonitorItem[]>("/admin/monitoring/cases");
  return response.data;
}

/**
 * Approve an investigation report and sign off.
 * POST /api/v1/admin/cases/{caseId}/approve
 */
export async function approveCase(caseId: string, notes: string | null): Promise<CaseDetail> {
  const response = await apiClient.post<CaseDetail>(`/admin/cases/${caseId}/approve`, { notes });
  return response.data;
}
