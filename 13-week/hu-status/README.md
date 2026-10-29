<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       13-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 13

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Juan Diego Mora Alvarado
- GITHUB_USER: juan0898
- TEAM: DI LUCCA Dental Care & Technology
- SPRINT_GOAL: Identify and document security threats at the API Gateway to Billing service trust boundary, prioritize security improvements, and propose automated security checks.
<!-- CONFIG-END -->

## 1. User stories worked this week

| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-SEC-001 | Restrict procedure price creation to administrators | todo | https://github.com/code-corhuila/dlc-docs/issues/134 |
| HU-SEC-002 | Reject invalid and impersonated Billing identities | todo | https://github.com/code-corhuila/dlc-docs/issues/135 |
| HU-SEC-003 | Prevent tampering with Billing procedure prices | todo | https://github.com/code-corhuila/dlc-docs/issues/136 |

## 2. My individual contribution

- Claimed the inbound `dlc-api-gateway` to `dlc-billing-api` trust boundary in issue #129.
- Documented the DI LUCCA attack surface, assets, entry points, and trust boundaries using Mermaid.
- Analyzed six STRIDE threats affecting Billing and prioritized them according to likelihood and impact.
- Documented proposed mitigations and residual risks in the security threat model.
- Opened PR #132 for the completed Billing STRIDE analysis.
- Created three security backlog issues with measurable acceptance criteria and automated test requirements.
- Proposed a Security CI workflow including Gitleaks, OWASP Dependency-Check, and negative authentication tests.
- Added Python tests for requests without authentication and requests with invalid Bearer tokens.
- Reviewed a teammate's Clinical Service threat model and published a technical comment about patient assignment authorization.

## 3. Blockers and risks

- The three security issues have not yet been confirmed in the DI LUCCA GitHub Project backlog because project selection was unavailable.
- The Billing authorization tests require a running, isolated test environment; execution has not yet been verified.
- The Security CI proposal requires confirmation of the actual Billing build configuration before activation.
- The library visit registration time, publication year, and library call number are still pending verification.
- PR #132 remains open for team review.

## 4. Plan for next week

- Coordinate the assignment of security issues #134, #135, and #136 to the team backlog.
- Validate the proposed negative authentication tests against the Billing test environment.
- Extend the automated tests to verify administrator-only price creation.
- Address review feedback on PR #132.
- Coordinate integration of approved security controls into Billing CI.

## 5. Compliance self-check

- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links

- Boundary claim: https://github.com/code-corhuila/dlc-docs/issues/129
- Attack surface: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/blob/main/13-week/workshop/01-attack-surface.md
- Initial STRIDE PR: https://github.com/code-corhuila/dlc-docs/pull/131
- STRIDE completion PR: https://github.com/code-corhuila/dlc-docs/pull/132
- Security issue P0: https://github.com/code-corhuila/dlc-docs/issues/134
- Security issue P1 (Spoofing): https://github.com/code-corhuila/dlc-docs/issues/135
- Security issue P1 (Tampering): https://github.com/code-corhuila/dlc-docs/issues/136
- Security CI commit: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/b742774
- Security CI documentation commit: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/8ad0595
- Peer review comment: https://github.com/code-corhuila/dlc-docs/pull/133#issuecomment-6500535596
- Workshop README: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/blob/main/13-week/workshop/README.md
