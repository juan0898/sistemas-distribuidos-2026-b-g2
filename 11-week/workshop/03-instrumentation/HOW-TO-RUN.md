
# CP3 — Billing Observability Prototype: How to Run

## 1. Purpose

This directory contains an independent Node.js observability prototype for the DI LUCCA Billing payment journey (HU-BIL-003).

It demonstrates trace-context creation, structured JSON logging, W3C `traceparent` formatting and parsing, and in-memory payment metrics.

**Scope limitation:** This prototype is not integrated into the production Billing backend, API Gateway, RabbitMQ, or notification worker. No real HTTP requests, database writes, or payment events are generated.

## 2. Requirements

- Node.js with native ES modules and the `node:test` module.
- No npm dependencies or external services.
- Run all commands from the repository root.

## 3. Run the automated tests

Test trace-context creation and structured logging:

```powershell
node --test --test-reporter=spec ".\11-week\workshop\03-instrumentation\observability.test.mjs"
```

Test W3C trace-context propagation and payment metrics:

```powershell
node --test --test-reporter=spec ".\11-week\workshop\03-instrumentation\telemetry.test.mjs"
```

Expected results from the previously verified local executions:

| Test file | Passed | Failed |
|---|---:|---:|
| `observability.test.mjs` | 5 | 0 |
| `telemetry.test.mjs` | 7 | 0 |
| **Total** | **12** | **0** |

These are local unit-test results, not measurements from a deployed service.

## 4. Implemented capabilities

### Trace context

`observability.mjs` generates a 32-character hexadecimal trace ID and a 16-character hexadecimal span ID. It can reuse a valid parent trace ID while creating a new span ID.

`telemetry.mjs` parses and formats W3C `traceparent` headers using version `00`. Invalid or all-zero identifiers are rejected.

**Limitation:** Header parsing and formatting are available as functions. Actual inbound HTTP extraction, outgoing HTTP injection, and cross-service propagation are not wired to running services.

### Structured logs

`createStructuredLogger()` emits JSON records containing:

- Timestamp, level, service, version, and environment.
- Trace ID, span ID, correlation ID, and event.
- Message, duration, and approved payment-related fields.

Unknown detail keys are excluded by an allowlist.

**Privacy limitation:** The allowlist restricts field names but does not redact sensitive values placed inside approved fields such as `message`. Production integration requires value-level sanitization and access controls.

### Payment metrics

`createPaymentMetrics()` maintains:

- A request counter grouped by operation and outcome.
- A cumulative duration histogram in milliseconds.
- Fixed duration buckets: 50, 100, 250, 500, 1000, 3000, and 5000 ms.

Allowed labels are limited to operation `record_payment` and outcomes `success`, `conflict`, and `error`.

**Limitation:** Metrics exist only in memory. No Prometheus endpoint, persistence, or production dashboard is configured.

## 5. Documentation alignment

The prototype is based on these DI LUCCA documentation elements:

1. `07-api/contracts/openapi/billing-service.yaml` — HU-BIL-003 payment recording, the invoice payment endpoint, and HTTP conflict responses.
2. `09-microservices/dependency-map.md` — Billing dependencies, including PostgreSQL, authentication, Patients, and RabbitMQ.
3. `09-microservices/communication-patterns.md` — synchronous REST operations and asynchronous payment events such as `PaymentRecorded`.

The journey and structured log contract are described in:

- `../01-journey.md`
- `../02-log-contract.md`

## 6. Production integration still required

Before production use, the team would need to integrate HTTP middleware, propagate trace context across authorized service calls, export metrics to a monitoring backend, validate privacy controls, and test failure scenarios against actual services.

Do not interpret the passing unit tests as proof of production observability.
