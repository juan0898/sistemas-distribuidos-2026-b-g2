<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       10-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 10

- FULL_NAME: Juan Diego Mora Alvarado
- GITHUB_USER: juan0898
- TEAM: DI LUCCA Dental Care & Technology
- SPRINT_GOAL: Deliver and validate Billing v2.0.0 through the develop, QA, and main environments with a reproducible Docker release.

## 1. User stories worked this week

| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-BIL-004 | Provide reliable Docker delivery for the Billing portal release | done | https://github.com/code-corhuila/dlc-billing-portal/commit/6df7680 |

## 2. My individual contribution

- Implemented and validated the Billing v2.0.0 release packaging workflow.
- Configured the Docker build to generate the Billing portal artifact at `/portals/billing/2.0.0/entry.js`.
- Investigated a Docker/Nginx deployment failure where the release artifact existed but returned HTTP 404.
- Identified the root cause as restrictive permissions inherited from the temporary release directory created during atomic publication.
- Updated the release publication process so the staged directory is readable and traversable by the Nginx worker before being atomically published.
- Added regression tests for the Docker release identifier and release-directory permissions.
- Preserved RED/GREEN TDD history using separate test and implementation commits.
- Validated the complete test suite with 25 test files and 187 passing tests.
- Validated the Docker image and confirmed that Nginx serves `/portals/billing/2.0.0/entry.js` with HTTP 200.
- Promoted the validated change from `develop` to `qa` and prepared its promotion to `main`.

## 3. Blockers and risks

- The first Docker build generated the portal under the demo release identifier instead of `2.0.0`.
- After correcting the release identifier, Nginx initially returned HTTP 404 because the generated release directory had restrictive permissions.
- The issue was mitigated with automated regression coverage and validation inside the Docker environment.
- Dependency security findings reported during `npm ci` remain outside the scope of this HU and should be reviewed separately without applying unsafe forced dependency upgrades.

## 4. Plan for next week

- Confirm the Billing Docker release fix in `main`.
- Verify the final Billing release evidence required for the course delivery.
- Review release documentation, CHANGELOG, and related ADR evidence.
- Continue integration validation between the Billing portal and the transversal frontend composition.
- Address the next Billing backlog item according to the documented contracts and Sprint priorities.

## 5. Compliance self-check

- [x] Conventional Commits - `type(scope): summary`
- [x] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [x] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links

- RED test commit:
  https://github.com/code-corhuila/dlc-billing-portal/commit/99f3d65

- GREEN implementation commit:
  https://github.com/code-corhuila/dlc-billing-portal/commit/6df7680

- QA RED promotion commit:
  https://github.com/code-corhuila/dlc-billing-portal/commit/5461ad4

- QA GREEN promotion commit:
  https://github.com/code-corhuila/dlc-billing-portal/commit/15c680a

- QA promotion merge:
  https://github.com/code-corhuila/dlc-billing-portal/commit/7ff8606
