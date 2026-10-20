
<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       11-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 11

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Juan Diego Mora Alvarado
- GITHUB_USER: juan0898
- TEAM: DI LUCCA Dental Care & Technology
- SPRINT_GOAL: Document and validate observability for the Billing payment journey (HU-BIL-003), including trace context, structured logs, automated tests, and golden-signal metrics.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-BIL-003 | Define observability for invoice payment recording | doing | https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/36babb9 |
| HU-BIL-003 | Implement and test an independent observability prototype | done | https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/623c369 |
| HU-BIL-003 | Define golden signals and payment metrics | done | https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/8dd82e8 |

## 2. My individual contribution
- Selected the HU-BIL-003 invoice payment journey and documented its service interactions.
- Defined structured JSON logs, trace identifiers, and privacy considerations.
- Developed a standalone Node.js observability prototype with trace context, W3C traceparent support, and in-memory payment metrics.
- Verified 12 automated tests across two test files, with zero failures in the recorded executions.
- Documented PromQL queries, golden signals, histogram buckets, and metric cardinality rules.
- Prepared personal reflections for CP0 through CP4.

## 3. Blockers and risks
- The available Billing frontend uses demonstration data; the observability prototype is not integrated into a real Billing backend.
- Prometheus scraping, dashboards, and live payment metrics have not been validated.
- Production HTTP instrumentation, value-level log sanitization, and cross-service trace propagation remain pending.

## 4. Plan for next week
- Define Billing service-level objectives and error budgets.
- Prepare alerting rules, an operational runbook, and an incident simulation.
- Complete the remaining workshop checkpoints and update the final evidence.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [x] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- CP0: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/14578a0
- CP1: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/36babb9
- CP2: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/3fbb746
- CP3 implementation: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/6c62099
- CP3 automated tests: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/d5d91cf
- CP3 execution guide: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/623c369
- CP4 metrics: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/8dd82e8

