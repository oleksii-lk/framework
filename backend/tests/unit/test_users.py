"""
UNIT TESTS — app/services/users.py
====================================
Tests for user lookup and password verification functions
"""

from app.services.users import authenticate_user, get_user, verify_password, pwd_context


class TestGetUser:
    def test_returns_existing_user(self, test_user):
        user = get_user(test_user["username"])
        assert user is not None
        assert user["username"] == test_user["username"]
        assert "hashed_password" in user
        assert "full_name" in user

    def test_returns_none_for_unknown_user(self):
        assert get_user("nobody") is None

    def test_returns_none_for_empty_string(self):
        assert get_user("") is None


class TestVerifyPassword:
    def test_correct_password_returns_true(self):
        hashed = pwd_context.hash("mypassword")
        assert verify_password("mypassword", hashed) is True

    def test_wrong_password_returns_false(self):
        hashed = pwd_context.hash("mypassword")
        assert verify_password("wrongpassword", hashed) is False

    def test_empty_password_does_not_match_nonempty_hash(self):
        hashed = pwd_context.hash("mypassword")
        assert verify_password("", hashed) is False


class TestAuthenticateUser:
    def test_valid_credentials_return_user(self, test_user):
        user = authenticate_user(test_user["username"], test_user["password"])
        assert user is not None
        assert user["username"] == test_user["username"]

    def test_wrong_password_returns_none(self, test_user):
        user = authenticate_user(test_user["username"], "definitelywrongpassword")
        assert user is None

    def test_unknown_user_returns_none(self, test_user):
        user = authenticate_user("nobody", test_user["password"])
        assert user is None

    def test_empty_credentials_returns_none(self):
        assert authenticate_user("", "") is None
