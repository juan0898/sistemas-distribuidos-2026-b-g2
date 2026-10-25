# Weekly Status - Week 12

<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       12-week/hu-status/README.md  (inside YOUR fork). English. -->

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Juan Diego Mora Alvarado
- GITHUB_USER: juan0898
- TEAM: DI LUCCA Dental Care & Technology
- SPRINT_GOAL: Integrate invoice issuance into the Billing portal, implement accessible error feedback, and validate the functionality through TDD and Angular builds.
<!-- CONFIG-END -->

## 1. User stories worked this week

| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-BIL-002 | Provide invoice review and issuance capabilities with HTTP integration and error feedback | doing | [Issuance integration](https://github.com/code-corhuila/dlc-billing-portal/commit/bdc1194), [Error feedback](https://github.com/code-corhuila/dlc-billing-portal/commit/991c74e) |

## 2. My individual contribution

- Integrated invoice issuance into `BillingCompositionRoot` using the existing HTTP adapter.
- Implemented role-based authorization for administrators and secretary assistants.
- Added invoice ID, status, and version validation before issuance.
- Prevented duplicate invoice issuance requests.
- Implemented accessible HTTP error feedback using Angular signals and `role="alert"`.
- Added 10 tests across two TDD increments, increasing the test suite from 320 to 330 passing tests.
- Completed separate RED and GREEN commits, validated Angular builds, and delivered both increments through GitHub branches and PRs.

## 3. Blockers and risks

- Safe idempotency-key reuse across retries remains pending.
- Stale asynchronous responses may affect invoice state after navigation.
- Invoice PDF generation and download are not yet integrated.
- Backend integration and end-to-end validation are still pending.

## 4. Plan for next week

- Implement safe invoice issuance retries with idempotency-key preservation.
- Prevent stale issuance responses after route changes or component destruction.
- Improve HTTP error feedback for specific response codes.
- Continue invoice PDF integration according to the documented API contracts.
- Complete remaining HU-BIL-002 frontend validation before backend integration.

## 5. Compliance self-check

- [x] Conventional Commits - `type(scope): summary`
- [x] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [x] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links

- [Invoice issuance RED commit](https://github.com/code-corhuila/dlc-billing-portal/commit/848c7a0)
- [Invoice issuance GREEN commit](https://github.com/code-corhuila/dlc-billing-portal/commit/bdc1194)
- [Invoice error feedback RED commit](https://github.com/code-corhuila/dlc-billing-portal/commit/0cdc3cd)
- [Invoice error feedback GREEN commit](https://github.com/code-corhuila/dlc-billing-portal/commit/991c74e)
- [Billing Portal Repository](https://github.com/code-corhuila/dlc-billing-portal)
- Validation: 330/330 Vitest tests passed; Angular production build passed.

