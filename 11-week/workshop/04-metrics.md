
# CP4 — Golden Signals and Metrics Catalog

## 1. Scope and objective

**Team:** DI LUCCA Dental Care & Technology  
**Domain:** Billing  
**Critical journey:** Record an invoice payment (HU-BIL-003)

The objective is to define measurable signals for the payment-recording journey, including successful payments, business conflicts, dependency failures, and resource pressure.

This document is a proposed monitoring contract. The metrics and PromQL expressions below have not been validated against a deployed Billing backend or Prometheus instance.

## 2. Golden signals

| Signal | What to measure | Why it matters |
|---|---|---|
| Latency | Payment request duration, including p95 and p99 | Detects slow payment processing |
| Traffic | Payment requests per second | Shows demand and workload changes |
| Errors | Failed requests and dependency failures | Detects unsuccessful operations |
| Saturation | Database connection utilization and queue backlog | Detects capacity constraints |

A business conflict (HTTP 409) is tracked separately from an infrastructure or server failure (HTTP 5xx). Conflicts may be expected outcomes of concurrency and idempotency rules.

## 3. Metrics catalog

| Metric | Type | Unit | Allowed labels |
|---|---|---|---|
| `billing_payment_requests_total` | Counter | requests | `operation`, `outcome` |
| `billing_payment_duration_seconds` | Histogram | seconds | `operation`, `outcome` |
| `billing_http_requests_total` | Counter | requests | `route`, `method`, `status_class` |
| `billing_dependency_requests_total` | Counter | calls | `dependency`, `outcome` |
| `billing_dependency_duration_seconds` | Histogram | seconds | `dependency`, `outcome` |
| `billing_db_connections_in_use` | Gauge | connections | `pool` |
| `billing_db_connections_max` | Gauge | connections | `pool` |
| `billing_outbox_pending_events` | Gauge | events | `event_type` |

**Approved label examples:**

- `operation="record_payment"`
- `outcome="success"`, `"conflict"`, or `"error"`
- `route="/api/v1/invoices/{id}/payments"`
- `method="POST"`
- `status_class="2xx"`, `"4xx"`, or `"5xx"`
- `dependency="postgres"`, `"patients"`, or `"rabbitmq"`
- `event_type="PaymentRecorded"`

The catalog describes desired production metrics. The CP3 prototype implements only an in-memory request counter and duration histogram; it does not expose these Prometheus metric names.

## 4. Latency histogram

Recommended production buckets, in seconds:

`0.05, 0.1, 0.25, 0.5, 1, 3, 5, +Inf`

The prototype uses equivalent millisecond boundaries from 50 to 5000 ms. Production histograms must also include the mandatory `+Inf` bucket.

### p95 payment latency

```promql
histogram_quantile(
  0.95,
  sum by (le) (
    rate(billing_payment_duration_seconds_bucket{
      operation="record_payment"
    }[5m])
  )
)
```

### p99 payment latency

```promql
histogram_quantile(
  0.99,
  sum by (le) (
    rate(billing_payment_duration_seconds_bucket{
      operation="record_payment"
    }[5m])
  )
)
```

## 5. Traffic and error queries

### Payment requests per second

```promql
sum(
  rate(billing_payment_requests_total{
    operation="record_payment"
  }[5m])
)
```

### Payment processing error ratio

```promql
sum(rate(billing_payment_requests_total{
  operation="record_payment",outcome="error"
}[5m]))
/
clamp_min(
  sum(rate(billing_payment_requests_total{
    operation="record_payment"
  }[5m])),
  0.001
)
```

### Business conflict rate

```promql
sum(rate(billing_payment_requests_total{
  operation="record_payment",outcome="conflict"
}[5m]))
```

This separate conflict metric helps distinguish expected concurrency or idempotency rejections from service outages.

## 6. Saturation queries

### Database connection utilization

```promql
billing_db_connections_in_use{pool="billing"}
/
clamp_min(billing_db_connections_max{pool="billing"}, 1)
```

### Pending payment events

```promql
billing_outbox_pending_events{event_type="PaymentRecorded"}
```

These queries require production exporters and instrumentation that are not currently implemented in the prototype.

## 7. Cardinality and privacy policy

Never use invoice IDs, payment IDs, patient IDs, email addresses, correlation IDs, trace IDs, or idempotency keys as metric labels.

Use normalized route templates instead of concrete URLs containing invoice identifiers.

Keep metric labels within explicitly approved, bounded values. Store per-request identifiers in controlled structured logs and trace context rather than time-series labels.

Do not place personal, payment-card, or authentication data in metric names or label values.

## 8. Documentation references

1. `07-api/contracts/openapi/billing-service.yaml` — HU-BIL-003, payment recording endpoint, successful responses, and HTTP 409 business conflicts.
2. `09-microservices/dependency-map.md` — Billing dependencies, including PostgreSQL, Patients, authentication, and RabbitMQ.
3. `09-microservices/communication-patterns.md` — synchronous REST operations, asynchronous `PaymentRecorded` events, and notification workflows.

Related workshop evidence:

- `01-journey.md` — payment journey and trace propagation.
- `02-log-contract.md` — structured logging and correlation.
- `03-instrumentation/HOW-TO-RUN.md` — prototype implementation and verified unit tests.

## 9. Validation status

**Defined:** metric names, types, labels, histogram boundaries, PromQL queries, and cardinality rules.

**Verified locally:** CP3 unit tests for the in-memory payment counter and duration histogram.

**Not verified:** Prometheus scraping, live dashboards, database saturation, production p95/p99, or real service error rates.

No production measurements are claimed in this checkpoint.
