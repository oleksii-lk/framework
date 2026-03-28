"""
Shared pytest fixtures — available to all tests in this directory tree.

Credentials are read from environment variables so they can differ between
environments without changing test code. Copy .env.example to .env and
export the values, or set them directly in your CI pipeline.

Default values match the hardcoded users in app/services/users.py, so
tests work out of the box with no extra setup.
"""

import os
import pytest


TEST_USER = {
    "username": os.getenv("TEST_USER_USERNAME", "alice"),
    "password": os.getenv("TEST_USER_PASSWORD", "password123"),
    "full_name": os.getenv("TEST_USER__FULL_NAME", "Alice Wonderland"),
}

@pytest.fixture
def test_user():
    """Primary test user."""
    return TEST_USER

