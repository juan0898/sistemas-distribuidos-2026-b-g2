
# CP8 — Security Test Execution Results

## Project Context

- Student: Juan Diego Mora Alvarado
- GitHub: juan0898
- Team: DI LUCCA Dental Care & Technology
- Service: `billing-service`
- Trust boundary: `dlc-api-gateway` -> `billing-service`
- Related security issue: https://github.com/code-corhuila/dlc-docs/issues/135
- STRIDE analysis: https://github.com/code-corhuila/dlc-docs/pull/132

## Objective

Execute the negative authentication tests created during CP4
and report their actual results without treating skipped tests
as successful security validation.

## Test Environment

| Component | Version or status |
|---|---|
| Operating system | Windows |
| Python | 3.14.7 |
| pytest | 9.2.0 |
| requests | 2.34.2 |
| Python virtual environment | `.venv` |
| Billing backend | Not available |
| `BILLING_BASE_URL` | Not configured |

## Execution Command

From the course repository root:

```powershell
python -m pytest 13-week/workshop/04-security-ci/test_negative_authz.py -v -rs
```

## Actual Test Results

| Test | Expected behavior | Actual result |
|---|---|---|
| `test_missing_bearer_token_returns_401` | HTTP 401 | SKIPPED |
| `test_invalid_bearer_token_returns_401` | HTTP 401 | SKIPPED |

Pytest output:

```text
collected 2 items

test_missing_bearer_token_returns_401 SKIPPED
test_invalid_bearer_token_returns_401 SKIPPED

2 skipped in 0.40s
```

Skip reason:

```text
BILLING_BASE_URL is not configured;
start an isolated Billing test environment first.
```

## Backend Availability Investigation

The following checks were performed:

1. `docker ps` returned no running containers.
2. `docker ps -a` showed frontend demos and an older MVP backend.
3. The MVP backend logs identified `OdontosysApiApplication`,
   not a verified implementation of `billing-service`.
4. The `dlc-billing-api` repository was cloned successfully.
5. The `develop`, `qa`, and `main` branches were inspected.
6. None of these branches contained an executable Billing API.

The inspected branches only contained repository governance
files and a README.

## Security Validation Assessment

- Tests collected: 2
- Tests passed: 0
- Tests failed: 0
- Tests skipped: 2
- HTTP 401 responses verified: 0

The test execution demonstrates that pytest can discover
the negative authentication tests.

It does not demonstrate that Billing correctly rejects
unauthenticated or invalid-token requests.

No authorization security control has been validated
against a running Billing backend.

## Required Follow-up

1. Provide an executable `billing-service` test deployment.
2. Confirm that `/api/v1/procedure-prices` is implemented.
3. Configure `BILLING_BASE_URL` for the isolated environment.
4. Execute both negative authentication tests again.
5. Require actual HTTP 401 results and zero skipped tests.
6. Save the successful or failed execution evidence.
