def test_admin_login_and_case_creation(api_client, admin_token):
    assert admin_token
    response = api_client.post("/api/v1/cases", json={"title": "E2E Case", "description": "Created by E2E test", "priority": "HIGH"})
    assert response.status_code == 201, response.text
    assert response.json()["title"] == "E2E Case"


def test_health_and_case_listing(api_client):
    assert api_client.get("/api/v1/health").status_code == 200
    response = api_client.get("/api/v1/cases")
    assert response.status_code == 200
    assert "items" in response.json()
