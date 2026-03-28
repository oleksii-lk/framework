"""
UNIT TESTS — app/services/auth.py
==================================
- create_access_token() produces a valid JWT string
- decode_access_token() can round-trip a token
- decode_access_token() returns None for a tampered token
- decode_access_token() returns None for an expired token
"""

from datetime import timedelta

from app.services.auth import create_access_token, decode_access_token


class TestCreateAccessToken:
    def test_returns_a_string(self):
        """The function should return a non-empty string"""
        token = create_access_token({"sub": "foo"})
        assert isinstance(token, str)
        assert len(token) > 0

    def test_encodes_subject(self):
        """The 'sub' claim should be recoverable"""
        token = create_access_token({"sub": "foo"})
        payload = decode_access_token(token)
        assert payload is not None
        assert payload["sub"] == "foo"

    def test_token_has_exp_claim(self):
        """Token must have an expiry claim"""
        token = create_access_token({"sub": "foo"})
        payload = decode_access_token(token)
        assert "exp" in payload

    def test_custom_expiry_is_respected(self):
        """Tokens created with a short expiry should expire sooner"""
        short = create_access_token({"sub": "foo"}, expires_delta=timedelta(minutes=1))
        long = create_access_token({"sub": "foo"}, expires_delta=timedelta(minutes=60))

        short_payload = decode_access_token(short)
        long_payload = decode_access_token(long)

        assert short_payload["exp"] < long_payload["exp"]


class TestDecodeAccessToken:
    def test_valid_token_returns_payload(self):
        """A fresh token should decode successfully"""
        token = create_access_token({"sub": "foo"})
        payload = decode_access_token(token)
        assert payload is not None
        assert payload["sub"] == "foo"

    def test_completely_invalid_string_returns_none(self):
        """A random string is not a valid JWT"""
        assert decode_access_token("not.a.token") is None

    def test_empty_string_returns_none(self):
        """An empty string should return None"""
        assert decode_access_token("") is None

    def test_expired_token_returns_none(self):
        """Tokens with a negative expiry should be rejected"""
        expired_token = create_access_token(
            {"sub": "foo"}, expires_delta=timedelta(seconds=-1)
        )
        assert decode_access_token(expired_token) is None
