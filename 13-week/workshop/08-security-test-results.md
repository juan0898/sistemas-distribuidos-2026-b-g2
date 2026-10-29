# CP8 — Security Test Execution Results

## Project Context

- Student: Juan Diego Mora Alvarado
- GitHub: juan0898
- Team: DI LUCCA Dental Care & Technology
- Service: `billing-service`
- Trust boundary: `dlc-api-gateway` -> `billing-service`
- Related issue: https://github.com/code-corhuila/dlc-docs/issues/135
- STRIDE analysis: https://github.com/code-corhuila/dlc-docs/pull/132

## Objective

Execute the negative authentication tests created during CP4,
validate the proposed security workflow, and report actual results
without treating skipped tests or configuration errors as success.

## Test Environment

| Component | Version or status |
|---|---|
| Operating system | Windows |
| Python | 3.14.7 |
| pytest | 9.2.0 |
| requests | 2.34.2 |
| PyYAML | 6.0.3 |
| Virtual environment | `.venv` |
| Billing backend | Not available |
| `BILLING_BASE_URL` | Not configured |

## Test Command

```powershell
python -m pytest 13-week/workshop/04-security-ci/test_negative_authz.py -v -rs
```

## Execution 1 — Original Test Behavior

The original fixture used `pytest.skip()` when the Billing test
environment was not configured.

Actual console summary:

```text
collected 2 items
2 skipped in 0.40s
```

- Passed: 0
- Failed: 0
- Skipped: 2
- HTTP 401 responses verified: 0

This execution did not validate Billing authentication.

## Execution 2 — Fail-Closed Test Configuration

The fixture was changed from `pytest.skip()` to `pytest.fail()`
to prevent an unconfigured test environment from silently
producing a successful CI result.

Actual console output:

```text
test_missing_bearer_token_returns_401 ERROR [ 50%]
test_invalid_bearer_token_returns_401 ERROR [100%]

Failed: BILLING_BASE_URL is not configured;
start an isolated Billing test environment first.

2 errors in 1.11s
```

- Tests collected: 2
- Passed: 0
- Failed: 0
- Errors during fixture setup: 2
- Skipped: 0
- HTTP 401 responses verified: 0

The second execution confirms that missing test configuration
is reported as an error rather than silently skipped.

It does not prove that Billing authentication is secure.

## Security Workflow Validation

File:

`13-week/workshop/04-security-ci/security.yml`

Validation tool: PyYAML 6.0.3.

Command:

```powershell
python -c "import yaml; p='13-week/workshop/04-security-ci/security.yml'; yaml.safe_load(open(p, encoding='utf-8')); print('PASS: security.yml has valid YAML syntax')"
```

Actual console output:

```text
PASS: security.yml has valid YAML syntax
```

Result: YAML syntax validation passed.

This is not a complete GitHub Actions workflow validation.
The workflow was not executed in GitHub Actions.

### Workflow Limitations

- Gitleaks is configured but has not been executed.
- The dependency audit assumes a Maven Billing project.
- The inspected `dlc-billing-api` branches contain no executable API.
- The authorization job requires a configured Billing test URL.
- The workflow is a proposal, not an active GitHub Actions workflow.

## Backend Availability Investigation

1. `docker ps` showed no running containers.
2. `docker ps -a` showed frontend demos and an older MVP backend.
3. The MVP backend was not verified as `billing-service`.
4. The `dlc-billing-api` repository was cloned.
5. The `develop`, `qa`, and `main` branches were inspected.
6. No executable Billing API was found in those branches.

## Security Validation Assessment

| Requirement | Result |
|---|---|
| Negative tests discovered | Yes |
| Missing configuration detected as an error | Yes |
| YAML syntax valid | Yes |
| Full GitHub Actions validation | Pending |
| HTTP 401 verified against Billing | Pending |
| HTTP 403 authorization verified | Pending |
| Real Billing service test execution | Pending |

## Required Follow-up

1. Provide an executable Billing test deployment.
2. Confirm `/api/v1/procedure-prices` is implemented.
3. Set `BILLING_BASE_URL` to the isolated test environment.
4. Rerun both negative authentication tests.
5. Verify HTTP 401 responses and zero skipped tests.
6. Validate the GitHub Actions workflow using `actionlint`.
7. Confirm the actual Billing dependency management configuration.
8. Activate the workflow only after team approval.

## Conclusion

CP8 records two real pytest executions and a successful YAML
syntax check.

The original tests were skipped. After changing the fixture,
the tests reported two setup errors because no Billing backend
was configured.

No HTTP 401 or HTTP 403 response has been verified against
a running Billing service.

Security validation remains incomplete.
