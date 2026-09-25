# Authentication and Authorization

This document fills the authentication section requested by the professor's guide. It describes the target contract, not deployed security controls. Existing requirements remain authoritative; implementation defaults selected during API design are identified below and in [design decisions](design-decisions.md).

## Actors and authority

Only `ADMINISTRATOR`, `DENTIST` and `SECRETARY_ASSISTANT` authenticate. Patients have no account, role or dashboard. Auth owns staff identity, credentials, MFA, sessions and role assignments; every business service owns authorization of its resources.

Ordinary Administrator registration creates Dentist or Secretary/Assistant accounts only. Initial Administrator provisioning is an audited deployment procedure, never a public registration endpoint. Do not embed bootstrap credentials in code or documentation.

## Authentication mechanism

Protected endpoints use `Authorization: Bearer <accessToken>`. Access tokens are RS256-signed JWTs with a one-hour lifetime. Validate the allowed algorithm, signature, issuer, intended audience, expiration and session eligibility; reject algorithm substitution or unsigned tokens. Keys carry `kid` and are published as public-only JWKS at `/api/v1/auth/jwks`.

Required claims for the contract design are `sub`, `iss`, `aud`, `iat`, `exp`, `jti`, `sid`, `roles` and `permissions`. The subject is the immutable staff UUID; `sid` identifies the session. Do not place patient information, passwords or refresh credentials in JWT claims. Issuer and audience values are deployment configuration and must match verifier allowlists; placeholder domains are not production settings.

Gateway removes caller-supplied identity headers and verifies credentials. Owner services independently verify the trusted identity and enforce resource permissions. JWT possession or Gateway validation alone never authorizes an unassigned patient or clinical access by Assistant.

## Staff login flow

1. Administrator registers staff; the account starts `PENDING_VERIFICATION`.
2. Staff consume a single-use email-verification token.
3. `/auth/login` validates credentials and eligibility. Disabled, locked or unverified accounts cannot start sessions. Return generic failures without disclosing account existence.
4. API design default: MFA is required for all staff. Successful password verification returns a short-lived challenge, not business access. Existing factors are verified through `/auth/mfa-verifications`.
5. First-time enrollment uses `/auth/mfa-enrollments` with that challenge; the enrollment credential cannot call business APIs. Return the provisional TOTP seed once over HTTPS. `/auth/mfa-enrollment-confirmations` proves possession before activating the factor and issuing a session. An existing factor cannot be replaced through this path.
6. Full authentication issues access and refresh tokens. The documented `Tokens | MfaChallenge` response also accommodates an explicitly revised MFA policy; with the current default, login always requires the MFA step.

TOTP follows [RFC 6238](https://www.rfc-editor.org/rfc/rfc6238.html): design default of six digits and 30-second steps, with bounded clock-skew tolerance and replay rejection. Encrypt seeds at rest; unlike single-use challenge tokens, TOTP seeds must be recoverable for verification. Password and refresh-token hashes remain non-recoverable.

## Expiration, rotation and revocation

| Control | Value | Origin |
|---|---|---|
| Access-token lifetime | 1 hour | Existing policy and requirements |
| Refresh-token lifetime | 7 days; rotate atomically on every use | Existing policy and requirements |
| Consecutive login failures | Lock after 3 | Confirmed policy alignment |
| Password hashing | bcrypt, cost >= 12 | Confirmed policy alignment |
| Temporary lock duration | 15 minutes | API design default |
| Login/MFA challenge and enrollment lifetime | 5 minutes | API design default |
| Email verification lifetime | 24 hours | API design default |
| Password reset lifetime | 15 minutes | API design default |
| Login rate limit | 10 attempts per IP per 5 minutes | API design default resolving the existing placeholder |

Password inputs retain the existing minimum of eight characters, an uppercase letter and a digit. Enforce bcrypt's 72-byte input bound before hashing, not merely a character count; never truncate silently. A future password-policy change must be coordinated with governance.

Refresh tokens are cryptographically random opaque credentials stored only as hashes. A replacement expires seven days after its issue in this design; reuse of a consumed/revoked token revokes its session family. The client must serialize refresh attempts to avoid racing its own token rotation. Disabled or locked accounts cannot refresh.

Logout revokes the current session, or all actor sessions when requested. Staff disable, password reset and role changes revoke affected sessions. Verifiers check revocation/session eligibility through the internal Auth contract and fail closed if it cannot be verified; an old JWT must not retain removed privileges for its remaining hour. Session metadata contains no raw token or hash.

## Credential transport and storage

HTTPS is required outside local development. Token and enrollment responses use `Cache-Control: no-store`. This contract uses refresh credentials in JSON request/response bodies, matching the existing Auth API. The initial browser design keeps tokens in memory only; a reload requires reauthentication. Do not put credentials in localStorage, URLs or logs. A future persistent HttpOnly-cookie flow requires explicit CSRF, cookie and CORS design before adoption.

Recovery acknowledgements are identical for existing and nonexistent accounts. Single-purpose verification/reset/challenge credentials are expiring, stored as hashes and consumed atomically. Resetting a password does not enable a disabled account. Lost-factor recovery is an audited administrator-supported operational procedure; it must not become an unrestricted MFA-bypass endpoint.

## Authorization matrix

| Capability | Administrator | Dentist | Secretary/Assistant |
|---|---|---|---|
| Staff and role management | Allowed; no ordinary Administrator creation/grant | Denied | Denied |
| Patient administrative creation | Allowed | Denied | Allowed |
| Administrative search/read | All authorized profiles | Assigned patients; minimal care projection | All administrative profiles |
| Administrative update | Allowed | Phone/email only during assigned care (design allowlist) | Allowed |
| Patient deactivation | Audited and appointment-guarded | Denied | Denied |
| Scheduling administration | Allowed | Own calendar; authorized care transitions | Allowed |
| Clinical read/write | Explicit clinical authorization/qualification required | Assigned/authorized patients | Denied |
| Prices/manual financial approval | Allowed | Denied | Denied |
| Invoice issue/payment registration | Allowed | Read only when explicitly authorized and assigned | Allowed |

Check role, operation permission, resource assignment, allowed fields and lifecycle state in the owner service. The API's `x-roles` metadata documents eligible roles but is not an enforcement engine. Derive actor and time server-side. Reject forbidden input fields; never silently accept writable `status`, monetary values in Clinical, or client-supplied audit identities.

## Public and internal boundaries

Unauthenticated operations are explicitly marked `security: []`: login/challenge proofs, refresh credentials, email verification, password recovery/reset, public JWKS and the single-purpose appointment confirmation command. They remain validated, rate-limited and purpose-constrained.

The patient email link opens a confirmation screen; GET never confirms a visit. The UI submits the signed token via `POST /api/v1/appointment-confirmations`. Scope the token to one appointment/version, expire it at appointment start, and invalidate it after use, cancellation or rescheduling. Return no patient profile. Redact token-bearing link URLs at edge/logging layers.

Internal coordination uses separate service credentials (short-lived signed service JWTs with explicit audience/scopes); no patient or ordinary staff role substitutes for a service identity. Internal routes are absent from Gateway. Service calls that act for a staff member also forward the validated staff context for owner-side authorization. See [internal contract](contracts/openapi/internal-coordination.yaml).

## Errors and verification

Use [guidelines](guidelines.md): `401` for missing/invalid authentication, `403` for an authenticated caller forbidden from an operation. On patient-scoped lookups, use indistinguishable `404` for nonexistent or out-of-scope resources to avoid identifier enumeration. Never include private fields in error details. `401` includes the applicable `WWW-Authenticate` challenge; rate limiting uses `429`.

Required implementation evidence includes negative role/assignment tests, field projection tests, rotation/reuse tests, revocation checks, disabled/unverified login rejection, MFA enrollment/replay tests and confirmation-token invalidation tests. Contract validity alone does not provide this evidence.

## Sources

- [Security policy](../00-governance/security-policy.md)
- [Security rules](../00-governance/security-rules.md)
- [Scope](../01-context/scope.md)
- [Stories](../04-requirements/user-stories.md)
- [Auth contract](contracts/openapi/auth-service.yaml)

## API-AUTH-01 — Observable authentication failures

Login, MFA verification and refresh use the same generic 401 error/message pair: UNAUTHORIZED / Authentication could not be completed. Invalid credentials and disabled, unverified or locked accounts must not produce distinguishable account-state messages. MFA rejection returns no session tokens. Refresh reuse still revokes the session family internally; its response does not reveal that history. Malformed request data remains 400, while throttling remains 429.

Under the current all-staff MFA policy, login returns a challenge; full access is issued only after the applicable MFA proof. The wider Tokens | MfaChallenge schema and the currently generic 409 responses remain explicit review gaps, not authorization to bypass MFA. See [Auth contract review](contract-reviews/auth.md).

