

<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       11-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 11

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Juan Diego Mora Alvarado
- GITHUB_USER: juan0898
- TEAM: DI LUCCA Dental Care & Technology
- SPRINT_GOAL: Complete and refine the Billing HU-BIL-003 observability workshop, covering tracing, structured logging, metrics, SLOs, alerting, incident response, and final evidence.
<!-- CONFIG-END -->

## 1. User stories worked this week

| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-BIL-003 | Document the invoice payment journey and observability contract | done | https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/36babb9 |
| HU-BIL-003 | Build and test an independent observability prototype | done | https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/623c369 |
| HU-BIL-003 | Define and refine payment metrics and SLOs | done | https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/af55324 |
| HU-BIL-003 | Refine alert rules and operational response policy | done | https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/023cd80 |
| HU-BIL-003 | Improve incident runbook and simulated failure analysis | done | https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/64203c1 |

## 2. My individual contribution

- Selected HU-BIL-003 and documented the critical invoice payment journey.
- Defined structured JSON logs, trace context, and correlation requirements.
- Built a standalone Node.js observability prototype.
- Executed 12 automated tests successfully across two test files.
- Refined the Golden Signals catalog, bounded metric labels, and cardinality estimates.
- Documented justified latency histogram buckets and proposed PromQL queries.
- Defined three distinct SLOs for payment availability, latency, and `PaymentRecorded` event freshness.
- Calculated hypothetical traffic estimates and error budgets for a 30-day window.
- Improved Prometheus alert rules with low-traffic safeguards and runbook links.
- Defined burn-rate calculations, severity levels, proposed routing, and escalation responsibilities.
- Expanded the Billing incident runbook with diagnostic queries and three risk-ordered mitigations.
- Documented a hypothetical PostgreSQL slowdown using a synthetic trace and four correlated JSON logs.
- Estimated incident impact and evaluated the proposed alert conditions.
- Defined three observability improvement stories with Given/When/Then acceptance criteria.
- Prepared individual checkpoint reflections and a final implementation plan.

## 3. Blockers and risks

- The Billing frontend currently uses static or in-memory demonstration data.
- The payment journey is not connected to a functional Billing backend or PostgreSQL database.
- The Node.js prototype is independent and does not instrument deployed services.
- Prometheus metrics, alert delivery, and cross-service tracing have not been validated.
- The CP9 incident is hypothetical; no real database slowdown or payment incident was observed.
- Traffic volumes, SLO thresholds, and alert safeguards require calibration using real measurements.
- Outbox event-freshness instrumentation and operational recovery procedures remain proposed.

## 4. Plan for next week

- Integrate observability with the authorized Billing backend when available.
- Instrument the payment endpoint and validate trace propagation across documented service boundaries.
- Introduce bounded Prometheus metrics and verify histogram buckets.
- Evaluate the availability, latency, and event-freshness SLOs using actual request data.
- Validate alert expressions, minimum-volume conditions, and notification routing.
- Verify payment consistency, idempotency, and safe recovery after uncertain outcomes.
- Prioritize the three improvement stories identified in CP9.

## 5. Compliance self-check

- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [x] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links

### Original checkpoint evidence

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
- CP10 final weekly status: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/91d62c7

### Corrections after instructor feedback

- CP6 scope and measurement rules: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/db77cce
- CP6 revised SLOs and budgets: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/af55324
- CP4 revised metrics and cardinality: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/028ada8
- CP7 revised alert rules: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/2397d09
- CP7 revised alert policy: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/023cd80
- CP8 revised runbook procedures: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/374ce44
- CP8 runbook PromQL diagnostics: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/df3b898
- CP9 revised incident and postmortem: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/7a348e9
- CP9 simulated trace and impact calculations: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/64203c1

### Reflection and workshop

- Personal reflection: https://docs.google.com/document/d/13C33fXcaJwwgcZA5jHfriCVwmpB-6n1KIio8piMvgV8/edit?usp=sharing
- Workshop folder: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/tree/main/11-week/workshop

## 7. Validation status

**Completed:** CP0-CP10 workshop documentation, independent Node.js prototype, 12 passing tests, revised metric catalog, SLO design, alert policy, incident runbook, and hypothetical postmortem.

**Not completed:** Production Billing integration, deployed Prometheus monitoring, operational alerting, real database incident testing, and actual SLO verification.
