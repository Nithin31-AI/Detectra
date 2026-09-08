import pytest


def test_websocket_connection(api_client):
    with api_client.websocket_connect("/api/v1/ws/events") as websocket:
        message = websocket.receive_json()
        assert message == {"type": "connected", "channel": "events"}


def test_redis_websocket_broadcast(api_client, live_services):
    with api_client.websocket_connect("/api/v1/ws/events") as websocket:
        assert websocket.receive_json()["type"] == "connected"
