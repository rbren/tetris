"""Tests for the main FastAPI application."""

from fastapi.testclient import TestClient

from tetris_backend.main import app

client = TestClient(app)


def test_root_endpoint() -> None:
    """Test the root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Tetris Backend API"
    assert data["version"] == "0.1.0"


def test_health_check() -> None:
    """Test the health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_game_status() -> None:
    """Test the game status endpoint."""
    response = client.get("/api/game/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ready"
    assert "message" in data
