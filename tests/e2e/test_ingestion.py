import io


def test_text_report_ingestion(api_client, live_services):
    response = api_client.post("/api/v1/ingestion/reports", files={"file": ("report.txt", io.BytesIO(b"Person A used wallet 0xabc and IP 192.0.2.1"), "text/plain")})
    assert response.status_code == 201, response.text
    assert response.json()["text_length"] > 0


