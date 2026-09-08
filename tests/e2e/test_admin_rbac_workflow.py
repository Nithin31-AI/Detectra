"""E2E verification of Admin RBAC and Admin Workflow."""

import pytest


def test_admin_rbac_and_workflow(api_client):
    # 1. Authenticate as investigator
    inv_res = api_client.post(
        "/api/v1/auth/token",
        data={"username": "investigator@example.com", "password": "demo-password"},
    )
    assert inv_res.status_code == 200
    inv_token = inv_res.json()["access_token"]
    inv_headers = {"Authorization": f"Bearer {inv_token}"}

    # 2. Verify investigator is FORBIDDEN (403) from admin endpoints
    # 2a. Admin monitoring
    mon_res = api_client.get("/api/v1/admin/monitoring/cases", headers=inv_headers)
    assert mon_res.status_code == 403
    assert "Admin privileges required" in mon_res.json()["detail"]

    # 2b. Case creation (admin-only)
    create_res = api_client.post(
        "/api/v1/cases",
        json={"title": "Unauthorized Case", "description": "Should fail", "priority": "LOW"},
        headers=inv_headers,
    )
    assert create_res.status_code == 403
    assert "Admin privileges required" in create_res.json()["detail"]

    # 2c. Admin case approve
    app_res = api_client.post(
        "/api/v1/admin/cases/CASE-001/approve",
        json={"notes": "Illegal attempt"},
        headers=inv_headers,
    )
    assert app_res.status_code == 403
    assert "Admin privileges required" in app_res.json()["detail"]

    # 3. Authenticate as admin
    admin_res = api_client.post(
        "/api/v1/auth/token",
        data={"username": "admin@system.local", "password": "AdminPass123!"},
    )
    assert admin_res.status_code == 200
    admin_token = admin_res.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # 4. Admin creates a case with title, description, priority, assigned investigator, and status
    new_case_payload = {
        "title": "E2E Cyber Fraud Ring Operation",
        "description": "Multi-tier investigation initiated by supervisory command.",
        "priority": "CRITICAL",
        "assigned_to": "investigator@example.com",
        "status": "Active",
    }
    case_created = api_client.post("/api/v1/cases", json=new_case_payload, headers=admin_headers)
    assert case_created.status_code == 201
    created_data = case_created.json()
    case_id = created_data["id"]
    assert created_data["title"] == new_case_payload["title"]
    assert created_data["assigned_to"] == "investigator@example.com"
    assert created_data["priority"] == "CRITICAL"

    # 5. Admin monitors investigation progress
    mon_admin_res = api_client.get("/api/v1/admin/monitoring/cases", headers=admin_headers)
    assert mon_admin_res.status_code == 200
    mon_items = mon_admin_res.json()
    assert len(mon_items) >= 1
    found_case = next((c for c in mon_items if c["id"] == case_id), None)
    assert found_case is not None
    assert found_case["assigned_to"] == "investigator@example.com"
    assert "job_status" in found_case

    # 6. Admin approves and signs off the case report
    approve_res = api_client.post(
        f"/api/v1/admin/cases/{case_id}/approve",
        json={"notes": "Final report audited and certified by Lead Administrator."},
        headers=admin_headers,
    )
    assert approve_res.status_code == 200
    approved_data = approve_res.json()
    assert approved_data["status"] == "Approved"
    assert approved_data["approved_by"] == "admin-user"
    assert approved_data["approved_at"] is not None
    assert approved_data["sign_off_notes"] == "Final report audited and certified by Lead Administrator."
