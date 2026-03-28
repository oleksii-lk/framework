"""
INTEGRATION TESTS — API endpoints
==================================
"""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def login(username: str, password: str):
    """Helper: POST /api/login and return the response."""
    return client.post(
        "/api/login",
        json={"username": username, "password": password},
    )


def auth_header(token: str) -> dict:
    """Helper: build an Authorization header dict."""
    return {"Authorization": f"Bearer {token}"}


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------


class TestHealthEndpoint:
    def test_health_returns_200(self):
        response = client.get("/api/health")
        assert response.status_code == 200

    def test_health_returns_ok_status(self):
        response = client.get("/api/health")
        assert response.json() == {"status": "ok"}


# ---------------------------------------------------------------------------
# POST /api/login
# ---------------------------------------------------------------------------


class TestLoginEndpoint:
    def test_valid_credentials_return_200(self, test_user):
        response = login(test_user["username"], test_user["password"])
        assert response.status_code == 200

    def test_valid_credentials_return_token(self, test_user):
        response = login(test_user["username"], test_user["password"])
        body = response.json()
        assert "access_token" in body
        assert body["token_type"] == "bearer"
        assert len(body["access_token"]) > 0

    def test_wrong_password_returns_401(self, test_user):
        response = login(test_user["username"], "definitelywrongpassword")
        assert response.status_code == 401

    def test_unknown_user_returns_401(self):
        response = login("nobody", "password123")
        assert response.status_code == 401

    def test_401_contains_error_detail(self, test_user):
        response = login(test_user["username"], "definitelywrongpassword")
        body = response.json()
        assert "detail" in body

    def test_empty_body_returns_422(self):
        response = client.post("/api/login", json={})
        assert response.status_code == 422


# ---------------------------------------------------------------------------
# GET /api/me
# ---------------------------------------------------------------------------


class TestMeEndpoint:
    def test_valid_token_returns_200(self, test_user):
        token = login(test_user["username"], test_user["password"]).json()["access_token"]
        response = client.get("/api/me", headers=auth_header(token))
        assert response.status_code == 200

    def test_valid_token_returns_correct_user(self, test_user):
        token = login(test_user["username"], test_user["password"]).json()["access_token"]
        response = client.get("/api/me", headers=auth_header(token))
        body = response.json()
        assert body["username"] == test_user["username"]
        assert body["full_name"] == test_user["full_name"]

    def test_no_token_returns_401(self):
        response = client.get("/api/me")
        assert response.status_code == 401

    def test_invalid_token_returns_401(self):
        response = client.get("/api/me", headers=auth_header("not.a.token"))
        assert response.status_code == 401
