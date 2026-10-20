
<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       11-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 11

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Juan Diego Mora Alvarado
- GITHUB_USER: juan0898
- TEAM: DI LUCCA Dental Care & Technology
- SPRINT_GOAL: Complete and document the Billing HU-BIL-003 observability workshop, including tracing, structured logging, metrics, SLOs, alerting, incident response, and final evidence.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-BIL-003 | Document the invoice payment journey and observability contract | done | https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/36babb9 |
| HU-BIL-003 | Build and test an independent observability prototype | done | https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/623c369 |
| HU-BIL-003 | Define payment metrics and service-level objectives | done | https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/800e4cb |
| HU-BIL-003 | Define alert rules and response policy | done | https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/7f7649d |
| HU-BIL-003 | Document incident response and simulated failure analysis | done | https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/d635924 |

## 2. My individual contribution
- Selected HU-BIL-003 and documented the critical invoice payment journey.
- Defined structured JSON logs, trace context, and correlation requirements.
- Built a standalone Node.js prototype for tracing, logging, and in-memory metrics.
- Executed 12 automated tests successfully across two test files.
- Defined golden signals, PromQL queries, histogram buckets, and cardinality rules.
- Proposed three SLOs with error budgets and operational response policies.
- Documented Prometheus alert rules, severity levels, and escalation procedures.
- Prepared a Billing incident runbook and a hypothetical dependency slowdown analysis.
- Proposed three observability improvement user stories.
- Prepared personal reflections for CP0 through CP9.

## 3. Blockers and risks
- The Billing frontend currently uses static or in-memory demonstration data.
- The payment flow is not connected to a functional Billing backend or PostgreSQL database.
- The Node.js prototype is independent and does not instrument deployed services.
- Prometheus metrics, alert delivery, and cross-service tracing have not been validated.
- The CP9 incident is hypothetical; no real database failure or payment incident was observed.

## 4. Plan for next week
- Integrate observability with the Billing backend when the authorized service becomes available.
- Validate metrics and trace propagation across actual service boundaries.
- Review alert thresholds using real measurements and request volumes.
- Verify payment consistency, idempotency, and operational recovery procedures.
- Prioritize the improvement stories identified during CP9.

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
- CP3 tracing: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/6c62099
- CP3 logging tests: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/f16b498
- CP3 telemetry: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/dd217d6
- CP3 telemetry tests: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/d5d91cf
- CP3 execution guide: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/623c369
- CP4 metrics: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/8dd82e8
- CP5 weekly status: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/aa676fd
- CP6 SLOs: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/800e4cb
- CP7 alert rules: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/d58633e
- CP7 alert policy: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/7f7649d
- CP8 runbook: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/a8e5457
- CP9 incident simulation: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/d635924
- Personal reflection: https://docs.google.com/document/d/13C33fXcaJwwgcZA5jHfriCVwmpB-6n1KIio8piMvgV8/edit?usp=sharing
