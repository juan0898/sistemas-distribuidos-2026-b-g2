# Auth Contract Review — API-AUTH-01

Status: proposed contract clarification for individual PR review; not runtime evidence.

## Decision

Make the existing generic authentication-failure policy observable through concrete 401 examples for login, MFA verification and refresh. [Auth OpenAPI](../contracts/openapi/auth-service.yaml).

## Rationale

Account eligibility and refresh reuse must be enforced internally without exposing account existence or credential history. Do not introduce a separate ACCOUNT_LOCKED response.

## Endpoint cases

All paths below use the public /api/v1 prefix. Request schemas, required fields and successful response shapes remain normative in the linked owner OpenAPI. Examples in this review describe expected behavior, not measured responses.

| Operation | Condition | Expected outcome |
|---|---|---|
| POST /auth/login | Invalid credentials or ineligible account | 401 UNAUTHORIZED with generic message |
| POST /auth/login | Valid password under current MFA policy | 200 MFA challenge, no business access |
| POST /auth/mfa-verifications | Invalid, expired or consumed proof | 401; no tokens |
| POST /auth/refresh | Invalid/expired/reused credential | 401; reuse also revokes family internally |
| These operations | Malformed request / throttled request | 400 / 429 respectively |

## Acceptance scenarios

- Compare login failure bodies for nonexistent, locked and wrong-password cases.
- Confirm a failed MFA proof never returns access or refresh tokens.
- Replay a consumed refresh token: verify family revocation and generic failure.
- Do not use real credentials in PR examples.

## Declared gaps

| Gap | Accountable owner | Closure evidence | State |
|---|---|---|---|
| Login union permits Tokens despite current mandatory MFA policy | Person 2 PR author | Review compatibility and narrow schema or document policy-specific constraints | Contract gap open |
| Generic 409 on proof operations has no precise condition | Person 2 PR author | Define a justified condition or remove unused response after review | Contract gap open |
| Authentication negative-path evidence | Person 2 PR author | Provider tests for generic failure and reuse rejection | Implementation pending |

The PR author must identify their name/GitHub account in the PR before requesting merge. Ownership here refers to the author of this individual contribution, not an invented team assignment. A documented decision may be closed while implementation evidence remains pending.

## References

- [API guidelines](../guidelines.md)
- [Design decisions](../design-decisions.md)
- Course reference: sistemas-distribuidos-2026-b-g1/08-week/02-session/spec/api-contract.md (read-only).

## Review recommendations

Record each reviewer finding in the PR with the applied correction or a reasoned rejection. Automatic approval does not replace the defense.

