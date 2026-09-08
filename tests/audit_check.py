import urllib.request
import urllib.parse
import json

BASE = "http://localhost:8000/api/v1"

def post_json(url, data, token=None):
    body = json.dumps(data).encode("utf-8")
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.getcode(), json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode("utf-8"))

def get_json(url, token=None):
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.getcode(), json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode("utf-8"))

def login(username, password):
    body = urllib.parse.urlencode({"username": username, "password": password}).encode("utf-8")
    req = urllib.request.Request(f"{BASE}/auth/token", data=body, headers={"Content-Type": "application/x-www-form-urlencoded"}, method="POST")
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))["access_token"]

print("=== STEP 1: Investigator Login & RBAC Rejection Check ===")
inv_token = login("investigator@example.com", "demo-password")
print("[PASS] Investigator token generated")

code, data = get_json(f"{BASE}/admin/monitoring/cases", token=inv_token)
print(f"Investigator GET /admin/monitoring/cases: HTTP {code} -> {data}")
assert code == 403, f"Expected 403, got {code}"
assert "Admin privileges required" in data["detail"]

code, data = post_json(f"{BASE}/cases", {"title": "Blocked Case", "description": "desc", "priority": "LOW"}, token=inv_token)
print(f"Investigator POST /cases: HTTP {code} -> {data}")
assert code == 403, f"Expected 403, got {code}"
assert "Admin privileges required" in data["detail"]

code, data = post_json(f"{BASE}/admin/cases/CASE-001/approve", {"notes": "Blocked"}, token=inv_token)
print(f"Investigator POST /admin/cases/CASE-001/approve: HTTP {code} -> {data}")
assert code == 403, f"Expected 403, got {code}"
assert "Admin privileges required" in data["detail"]

print("\n=== STEP 2: Admin Login & Full Workflow Check ===")
admin_token = login("admin@system.local", "AdminPass123!")
print("[PASS] Admin token generated")

new_case = {
    "title": "Operation Chimera: High-Tech Cybercrime Syndicate",
    "description": "Multi-tier cross-border financial and ransomware network investigation.",
    "priority": "CRITICAL",
    "assigned_to": "investigator@example.com",
    "status": "Active"
}
code, case_data = post_json(f"{BASE}/cases", new_case, token=admin_token)
case_id = case_data["id"]
print(f"Admin POST /cases: HTTP {code} -> Created {case_id}: {case_data['title']}")
assert code == 201
assert case_data["assigned_to"] == "investigator@example.com"
assert case_data["priority"] == "CRITICAL"

code, mon_data = get_json(f"{BASE}/admin/monitoring/cases", token=admin_token)
print(f"Admin GET /admin/monitoring/cases: HTTP {code} -> {len(mon_data)} cases in monitoring queue")
assert code == 200
matching = [c for c in mon_data if c["id"] == case_id]
assert len(matching) > 0
print(f"Monitoring details for {case_id}: Evidence count={matching[0]['evidence_count']}, Job status={matching[0]['job_status']}")

code, app_data = post_json(f"{BASE}/admin/cases/{case_id}/approve", {"notes": "Supervisory approval signed and filed by Lead Admin."}, token=admin_token)
print(f"Admin POST /admin/cases/{case_id}/approve: HTTP {code} -> Status: {app_data['status']}, SignedBy: {app_data['approved_by']}")
assert code == 200
assert app_data["status"] == "Approved"
assert app_data["approved_by"] == "admin-user"
assert app_data["sign_off_notes"] == "Supervisory approval signed and filed by Lead Admin."

print("\n=== ALL LIVE SECURITY & WORKFLOW AUDITS PASSED PERFECTLY! ===")
