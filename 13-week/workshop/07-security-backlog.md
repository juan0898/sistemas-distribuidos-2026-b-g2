# CP7 — Security Backlog Refinement

## Project Context

- Student: Juan Diego Mora Alvarado
- GitHub: juan0898
- Team: DI LUCCA Dental Care & Technology
- Service: `billing-service`
- Trust boundary: `dlc-api-gateway` -> `billing-service`
- STRIDE PR: https://github.com/code-corhuila/dlc-docs/pull/132
- CP6 commit: https://github.com/code-corhuila/dlc-docs/commit/ba27dcc

## Objective

Refine the three security user stories identified during CP3.

The refinement incorporates peer review feedback, strengthens
acceptance criteria, and defines measurable security tests.

## Refined Security Stories

| Issue | STRIDE | Risk | Priority | Status |
|---|---|---|---|---|
| #134 | E - Elevation of Privilege | 9 | P0 | Backlog |
| #135 | S - Spoofing | 6 | P1 | Backlog |
| #136 | T - Tampering | 6 | P1 | Backlog |

### Issue #134 — Elevation of Privilege

URL: https://github.com/code-corhuila/dlc-docs/issues/134

The original story protected procedure price creation through
`POST /api/v1/procedure-prices`.

The refined story also addresses unauthorized manual charges through
`POST /api/v1/manual-charges`, following the peer review of PR #132.

Acceptance criteria include:

- Non-administrators cannot create procedure price versions.
- Dentists cannot charge consultations without an active assignment.
- Manual charges require justification and a clinical source reference.
- Rejected operations must not modify financial records.
- Automated negative authorization tests must run in CI.

### Issue #135 — Spoofing

URL: https://github.com/code-corhuila/dlc-docs/issues/135

The refined story focuses on caller identity validation at the
Billing service boundary.

Acceptance criteria include:

- Missing and invalid Bearer tokens return `401 Unauthorized`.
- Invalid identity headers cannot bypass authentication.
- Unauthorized requests do not expose protected Billing data.
- Negative authentication tests must execute without being skipped.

The initial Python tests are documented in CP4.
Execution against a running Billing service remains pending.

### Issue #136 — Tampering

URL: https://github.com/code-corhuila/dlc-docs/issues/136

The refined story protects financial values and historical records.

Acceptance criteria include:

- Zero or negative `basePrice` values are rejected.
- Conflicting price validity periods are rejected.
- Rejected requests leave existing price versions unchanged.
- Historical invoice price snapshots remain protected.
- Automated negative financial validation tests run in CI.

## Traceability

| Threat | Security Story | Proposed Test |
|---|---|---|
| E | #134 | Unauthorized price creation returns 403 |
| E | #134 | Unassigned dentist cannot register a manual charge |
| S | #135 | Missing or invalid token returns 401 |
| T | #136 | Invalid price values are rejected without persistence |

## Current Verification Status

The three stories were updated in the DI LUCCA GitHub repository
and assigned to the team project with Backlog status.

Their acceptance criteria describe expected behavior.
They do not establish that the controls are implemented.

The CP4 authentication tests have been written, but successful
execution against an isolated Billing environment is not yet verified.

## References

- STRIDE analysis: https://github.com/code-corhuila/dlc-docs/pull/132
- Peer review correction: https://github.com/code-corhuila/dlc-docs/commit/ba27dcc
- Issue #134: https://github.com/code-corhuila/dlc-docs/issues/134
- Issue #135: https://github.com/code-corhuila/dlc-docs/issues/135
- Issue #136: https://github.com/code-corhuila/dlc-docs/issues/136
- Security CI: `13-week/workshop/04-security-ci/`

## Conclusion

CP7 translates the updated STRIDE findings into measurable
security backlog requirements for the Billing service.

The next step is to validate the negative authorization tests
against an isolated test environment.
