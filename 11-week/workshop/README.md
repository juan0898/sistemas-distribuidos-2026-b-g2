
<!-- OBSERVABILITY WORKSHOP - WEEK 11
     Keep the CONFIG-START and CONFIG-END markers.
     Workshop evidence must be written in English.
     Path: 11-week/workshop/README.md -->

# Observability Workshop - Week 11

<!-- CONFIG-START -->
- FULL_NAME: Juan Diego Mora Alvarado
- GITHUB_USER: juan0898
- TEAM: DI LUCCA Dental Care & Technology
- DOCS_REPO: https://github.com/code-corhuila/dlc-docs
- REFLECTION_DOC: https://docs.google.com/document/d/13C33fXcaJwwgcZA5jHfriCVwmpB-6n1KIio8piMvgV8/edit?usp=sharing
- JOURNEY: Record an invoice payment (HU-BIL-003) - 01-journey.md
<!-- CONFIG-END -->

## 1. Project information

| Field | Description |
|---|---|
| Project | DI LUCCA Dental Care & Technology |
| Domain | Billing |
| Workshop | Observability, SLOs, and Incident Response |
| Week | 11 |
| Status | Completed - academic workshop deliverables and feedback corrections |

## 2. Workshop objective

Apply observability practices to the Billing domain using distributed tracing, structured logging, metrics, service level objectives, alerting, and incident response.

The workshop documents a proposed observability architecture and includes an independent Node.js prototype with automated tests.

The workshop does not represent deployed backend instrumentation, production monitoring, or a live incident response exercise.

## 3. Critical user journey

- Journey: Record an invoice payment (HU-BIL-003).
- Reference: `01-journey.md`.
- Entry point: `POST /api/v1/invoices/{id}/payments`.
- Related components: API Gateway, Billing service, PostgreSQL, RabbitMQ, notification worker, and documented service dependencies.
- Proposed trace propagation: W3C `traceparent`, trace IDs, span IDs, and correlation identifiers.
- Prototype scope: independent Node.js instrumentation, structured logs, and in-memory metrics.

The documented journey includes payment validation, authoritative transaction processing, `PaymentRecorded` publication, and asynchronous notification handling.

**Current implementation:** The Billing frontend uses static or in-memory demonstration data. It is not connected to a functional Billing backend or PostgreSQL database.

## 4. Workshop checkpoints

| Checkpoint | Deliverable | Status |
|---|---|---|
| CP0 | Workshop setup and configuration | Done |
| CP1 | Critical journey and trace propagation | Done |
| CP2 | Structured logging contract | Done |
| CP3 | Independent instrumentation prototype and automated tests | Done |
| CP4 | Golden signals, metric catalog, and cardinality calculations | Done |
| CP5 | Delivery 1 HU status update | Done |
| CP6 | Three distinct SLOs, PromQL, and error budgets | Done |
| CP7 | Burn-rate alert rules and operational response policy | Done |
| CP8 | Incident runbook with PromQL and risk-ordered mitigations | Done |
| CP9 | Hypothetical incident, synthetic trace, logs, and postmortem | Done |
| CP10 | Delivery 2 HU status and final evidence review | Done |

All statuses refer to academic workshop deliverables, not implemented production capabilities.

## 5. Individual contribution

- Selected and documented the HU-BIL-003 invoice payment journey.
- Defined structured JSON logging, correlation identifiers, and privacy restrictions.
- Developed an independent Node.js observability prototype.
- Executed 12 automated unit tests successfully.
- Defined Golden Signals, bounded metric labels, and cardinality calculations.
- Proposed histograms and PromQL queries for payment and dependency monitoring.
- Documented three independent SLOs for availability, latency, and `PaymentRecorded` event freshness.
- Estimated hypothetical payment traffic and calculated request-based and time-based error budgets.
- Updated alert rules with multi-window burn rates and low-volume safeguards.
- Documented theoretical budget consumption, routing, escalation, and excluded cause-based alerts.
- Expanded the incident runbook with diagnostic queries and three risk-ordered mitigations.
- Analyzed a hypothetical 40-minute PostgreSQL slowdown.
- Prepared an illustrative distributed trace and four correlated JSON logs.
- Calculated conditional incident impact and evaluated alert behavior.
- Defined three improvement stories using Given/When/Then acceptance criteria.
- Prepared checkpoint reflections and final weekly status evidence.

## 6. Blockers and risks

- Billing currently relies on static or in-memory frontend demonstration data.
- No functional backend-to-PostgreSQL payment integration is available in the current environment.
- The Node.js prototype is not connected to deployed Billing services.
- Prometheus scraping, live alerts, and production trace propagation remain unverified.
- The `PaymentRecorded` freshness metric is proposed, not deployed.
- The CP9 incident is hypothetical and does not represent an observed production failure.
- Traffic estimates, SLO thresholds, and alert safeguards require calibration with real data.
- Production integration requires authorized contracts, operational testing, and privacy validation.

## 7. Compliance self-check

- [x] Workshop configuration completed
- [x] Reflection document shared with the instructor
- [x] Critical journey documented against project references
- [x] Structured logging contract documented
- [ ] Distributed tracing integrated and tested across deployed microservices
- [x] Independent tracing prototype and automated tests completed
- [x] Golden signals and SLOs defined
- [x] Alerting rules and runbook documented
- [x] Hypothetical incident exercise documented
- [x] Individual commits and pushes recorded
- [x] Weekly HU status updated

The tracing prototype is independent; end-to-end propagation across deployed services remains pending.

The incident exercise contains synthetic evidence, not live fault injection.

## 8. Original checkpoint evidence

- CP0: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/14578a0
- CP1: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/36babb9
- CP2: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/3fbb746
- CP3 instrumentation: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/6c62099
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
- CP10 original weekly status: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/91d62c7
- Workshop README completion: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/890da8a

## 9. Corrections after instructor feedback

- CP6 measurement scope: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/db77cce
- CP6 SLOs and error budgets: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/af55324
- CP4 metrics and cardinality: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/028ada8
- CP7 alert rules: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/2397d09
- CP7 alert policy: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/023cd80
- CP8 incident procedures: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/374ce44
- CP8 PromQL diagnostics: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/df3b898
- CP9 incident analysis: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/7a348e9
- CP9 trace, logs, and calculations: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/64203c1
- CP10 revised weekly status: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/bf3f58f

## 10. Reflection and documentation

- Reflection document: https://docs.google.com/document/d/13C33fXcaJwwgcZA5jHfriCVwmpB-6n1KIio8piMvgV8/edit?usp=sharing
- Project documentation: https://github.com/code-corhuila/dlc-docs
- Weekly HU status: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/blob/main/11-week/hu-status/README.md
- Workshop folder: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/tree/main/11-week/workshop

## 11. Validation status

**Completed:** Workshop documentation for CP0-CP10, independent Node.js prototype, 12 passing automated tests, instructor-feedback corrections, revised SLOs, updated alerts, incident runbook, and hypothetical postmortem.

**Not validated:** Real Billing backend instrumentation, production Prometheus monitoring, operational alert delivery, real database recovery, actual payment execution, or measured production SLOs.

The workshop demonstrates a proposed observability solution and a standalone prototype, not a deployed production observability platform.
