
<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       13-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 13

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Juan Diego Mora Alvarado
- GITHUB_USER: juan0898
- TEAM: DI LUCCA Dental Care & Technology
- SPRINT_GOAL: Complete the API Gateway to Billing threat model, refine security backlog stories, document negative test execution, and define an implementation plan.
<!-- CONFIG-END -->

## 1. User stories worked this week

| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-SEC-001 | Restrict procedure price creation to administrators | todo | https://github.com/code-corhuila/dlc-docs/issues/134 |
| HU-SEC-002 | Reject invalid and impersonated Billing identities | todo | https://github.com/code-corhuila/dlc-docs/issues/135 |
| HU-SEC-003 | Prevent tampering with Billing procedure prices | todo | https://github.com/code-corhuila/dlc-docs/issues/136 |

## 2. My individual contribution

- Claimed the inbound `dlc-api-gateway` to Billing trust boundary in issue #129.
- Documented Billing assets, entry points, and trust boundaries using Mermaid.
- Identified six STRIDE threats and prioritized them by likelihood and impact.
- Opened STRIDE completion PR #132 in the DI LUCCA documentation repository.
- Addressed peer feedback about unauthorized manual charges on unassigned consultations.
- Refined the three security backlog issues with testable acceptance criteria.
- Added all three security issues to the DI LUCCA project backlog.
- Proposed CI checks using Gitleaks, OWASP Dependency-Check, and pytest.
- Created negative authentication tests for missing and invalid Bearer tokens.
- Executed the tests locally and documented the actual skipped results.
- Investigated Billing backend availability using Docker and the API repository.
- Reviewed a teammate's Clinical threat model and published technical feedback.
- Recorded the library visit and consulted Pressman's software engineering book.
- Prepared an individual implementation plan covering authorization, data integrity, and security testing.

## 3. Blockers and risks

- The Billing API repository does not currently provide an executable service on the inspected branches.
- Both negative authentication tests were skipped because `BILLING_BASE_URL` was not configured.
- HTTP 401 and HTTP 403 behavior has not yet been validated against a running Billing backend.
- The proposed `security.yml` workflow has not been activated or independently validated.
- The three security backlog stories describe pending controls, not implemented features.
- STRIDE completion PR #132 remains open and has not been merged.

## 4. Plan for next week

- Coordinate implementation of the P0 authorization controls in Billing.
- Verify dentist assignment before accepting manual charges.
- Prepare an isolated, executable Billing test environment.
- Rerun negative authentication and authorization tests against the actual service.
- Validate the proposed Security CI workflow and confirm the Billing build configuration.
- Continue addressing review feedback and coordinate approval of STRIDE PR #132.
- Implement financial input validation and auditability according to backlog priorities.

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
- P0 security issue: https://github.com/code-corhuila/dlc-docs/issues/134
- P1 Spoofing issue: https://github.com/code-corhuila/dlc-docs/issues/135
- P1 Tampering issue: https://github.com/code-corhuila/dlc-docs/issues/136
- Security CI proposal: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/b742774
- Security CI documentation: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/8ad0595
- Peer review comment: https://github.com/code-corhuila/dlc-docs/pull/133#issuecomment-6500535596
- CP6 STRIDE review changes: https://github.com/code-corhuila/dlc-docs/pull/132
- CP7 backlog refinement: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/5febd5c
- CP8 test execution report: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/1448efb
- Workshop README: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/blob/main/13-week/workshop/README.md
