
# CP4 — Security CI: How to Run

## Project Context

- Team: DI LUCCA Dental Care & Technology
- Service: `billing-service`
- Trust boundary: `dlc-api-gateway` -> `billing-service`
- STRIDE analysis: https://github.com/code-corhuila/dlc-docs/pull/132
- Related issues: #134, #135, #136

## Security Checks

The proposed `security.yml` workflow includes three checks:

1. **Gitleaks:** Detect credentials, API keys, and secrets accidentally committed to the repository.
2. **Dependency audit:** Identify known vulnerabilities in Billing dependencies using OWASP Dependency-Check for Maven.
3. **Negative authorization tests:** Verify that Billing rejects requests without valid authentication.

## Requirements

- Python 3.12 or later
- Python packages: `pytest` and `requests`
- A running, isolated Billing test environment
- `BILLING_BASE_URL` pointing to that environment
- Java 21 and Maven for the proposed dependency audit
- GitHub Actions for the proposed CI workflow

## Run Authorization Tests Locally

Install the Python dependencies:

```powershell
python -m pip install pytest requests
```

Configure the Billing test environment URL:

```powershell
$env:BILLING_BASE_URL = "http://localhost:8080"
```

Replace the example URL with the actual address of an isolated Billing test environment.

Run the tests from the course repository root:

```powershell
python -m pytest 13-week/workshop/04-security-ci/test_negative_authz.py -v
```

## Expected Results

| Scenario | Expected HTTP Status |
|---|---|
| Request without Bearer token | 401 Unauthorized |
| Request with invalid Bearer token | 401 Unauthorized |

The tests must fail if Billing accepts an unauthenticated request.

If `BILLING_BASE_URL` is missing, the tests are skipped. A skipped test does not demonstrate successful authorization enforcement.

## CI Integration

The `security.yml` file is a workshop proposal and is not automatically executed from `13-week/workshop/04-security-ci/`.

Before enabling it in a service repository:

1. Confirm the actual Billing build tool and directory.
2. Configure a reachable, isolated Billing test environment.
3. Configure the `BILLING_BASE_URL` variable.
4. Review the security tools and their required permissions.
5. Obtain team approval before installing the workflow under `.github/workflows/`.

The current proposal assumes Maven and Java 21. These assumptions must be verified against the actual Billing repository.

## Traceability

- P0 Elevation of Privilege: https://github.com/code-corhuila/dlc-docs/issues/134
- P1 Spoofing: https://github.com/code-corhuila/dlc-docs/issues/135
- P1 Tampering: https://github.com/code-corhuila/dlc-docs/issues/136

The negative authentication tests provide initial evidence for the Spoofing threat. Separate role-based authorization tests are still required to verify the `ADMINISTRATOR` restriction in issue #134.

## Definition of Done

- Security workflow proposal documented.
- Negative authentication tests implemented.
- Local execution instructions provided.
- No production secrets or credentials included.
- CI activation deferred until integration requirements are verified.
```
