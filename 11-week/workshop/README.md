
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
| Status | Completed - academic workshop deliverables |

## 2. Workshop objective

Apply observability practices to the Billing domain using distributed tracing, structured logging, metrics, service level objectives, alerting, and incident response.

The workshop documents the proposed architecture and includes a standalone Node.js observability prototype. It does not represent deployed backend instrumentation.

## 3. Critical user journey

- JOURNEY: Record an invoice payment (HU-BIL-003) - 01-journey.md
- Entry point: `POST /api/v1/invoices/{id}/payments`
- Related components: API Gateway, Billing service, PostgreSQL, RabbitMQ, notification worker, and documented service dependencies.
- Trace propagation: W3C `traceparent`, trace IDs, span IDs, and correlation identifiers, demonstrated in an independent Node.js prototype.

The documented journey includes payment validation, transaction processing, payment events, and asynchronous notification handling.

**Current implementation:** The Billing frontend uses static or in-memory demonstration data and is not connected to a functional Billing backend or PostgreSQL database.

## 4. Workshop checkpoints

| Checkpoint | Deliverable | Status |
|---|---|---|
| CP0 | Workshop setup and configuration | Done |
| CP1 | Critical journey and trace propagation | Done |
| CP2 | Structured logging contract | Done |
| CP3 | Instrumentation prototype and automated tests | Done |
| CP4 | Golden signals and metric catalog | Done |
| CP5 | Delivery 1 HU status update | Done |
| CP6 | SLOs and error budget | Done |
| CP7 | Burn-rate alerting | Done |
| CP8 | Incident response runbook | Done |
| CP9 | Hypothetical incident analysis and postmortem | Done |
| CP10 | Delivery 2 HU status update | Done |

All statuses refer to workshop deliverables, not deployment or production integration.

## 5. Individual contribution

- Selected and documented the HU-BIL-003 invoice payment journey.
- Defined structured logging, trace identifiers, and privacy considerations.
- Developed a standalone Node.js prototype for trace context and payment metrics.
- Executed 12 automated unit tests successfully.
- Proposed golden signals, PromQL queries, SLOs, and error budgets.
- Documented alert rules, alert response policy, and incident runbook.
- Analyzed a hypothetical 40-minute dependency slowdown.
- Proposed three observability improvement user stories.
- Completed personal reflections for CP0 through CP10.

## 6. Blockers and risks

- Billing currently relies on static or in-memory frontend demonstration data.
- No functional backend-to-PostgreSQL payment integration is available in the current environment.
- The Node.js prototype is not connected to the deployed Billing frontend or service infrastructure.
- Prometheus scraping, live alerts, and production trace propagation remain unverified.
- The CP9 incident is hypothetical and does not represent observed production failures.
- Production integration requires authorized service contracts, testing, and privacy validation.

## 7. Compliance self-check

- [x] Workshop configuration completed
- [x] Reflection document shared with the instructor
- [x] Critical journey validated against project documentation
- [x] Structured logging contract documented
- [ ] Distributed tracing implemented and tested
- [x] Golden signals and SLOs defined
- [x] Alerting rules and runbook documented
- [x] Incident drill completed
- [x] Individual commits and pushes recorded
- [x] Weekly HU status updated

Distributed tracing was implemented and tested only in a standalone prototype; it has not been integrated across running microservices.

The incident drill was a documented hypothetical exercise, not live fault injection.

## 8. Evidence links

- Reflection: https://docs.google.com/document/d/13C33fXcaJwwgcZA5jHfriCVwmpB-6n1KIio8piMvgV8/edit?usp=sharing
- Project documentation: https://github.com/code-corhuila/dlc-docs
- CP0 commit: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/14578a0
- CP1 commit: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/36babb9
- CP2 commit: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/3fbb746
- CP3 implementation: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/6c62099
- CP3 tests: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/f16b498
- CP3 telemetry: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/dd217d6
- CP3 telemetry tests: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/d5d91cf
- CP3 execution guide: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/623c369
- CP4 metrics: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/8dd82e8
- CP5 status: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/aa676fd
- CP6 SLOs: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/800e4cb
- CP7 alerts: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/d58633e
- CP7 alert policy: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/7f7649d
- CP8 runbook: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/a8e5457
- CP9 incident: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/d635924
- CP10 final status: https://github.com/juan0898/sistemas-distribuidos-2026-b-g2/commit/91d62c7
