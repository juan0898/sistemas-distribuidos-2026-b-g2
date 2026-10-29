
"""Negative authentication tests for DI LUCCA Billing."""

import os

import pytest
import requests


BASE_URL = os.getenv("BILLING_BASE_URL", "").rstrip("/")

# Billing API endpoint documented in the OpenAPI contract.
PROTECTED_PATH = "/api/v1/procedure-prices"


@pytest.fixture
def billing_url():
    """Require an explicit non-production Billing test environment."""
    if not BASE_URL:
        pytest.skip(
            "BILLING_BASE_URL is not configured; "
            "start an isolated Billing test environment first."
        )

    return f"{BASE_URL}{PROTECTED_PATH}"


def test_missing_bearer_token_returns_401(billing_url):
    """Unauthenticated users must not access protected prices."""
    response = requests.get(
        billing_url,
        headers={"Accept": "application/json"},
        timeout=10,
    )

    assert response.status_code == 401, (
        f"Expected 401 for a missing token, "
        f"received {response.status_code}"
    )


def test_invalid_bearer_token_returns_401(billing_url):
    """An invalid Bearer token must not authenticate a user."""
    response = requests.get(
        billing_url,
        headers={
            "Accept": "application/json",
            "Authorization": "Bearer invalid-test-token",
        },
        timeout=10,
    )

    assert response.status_code == 401, (
        f"Expected 401 for an invalid token, "
        f"received {response.status_code}"
    )
