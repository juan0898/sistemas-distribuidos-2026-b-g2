# CP4 - Golden Signals and Metrics Catalog

## 1. Scope

**Team:** DI LUCCA Dental Care & Technology  
**Domain:** Billing  
**Critical journey:** Record an invoice payment (HU-BIL-003)  
**Endpoint:** `POST /api/v1/invoices/{id}/payments`

This document defines proposed metrics for payment recording, its dependencies, and asynchronous publication of `PaymentRecorded`.

The Billing frontend currently uses static or in-memory demonstration data. No production Billing metrics or Prometheus deployment are available. The catalog is a future instrumentation contract, not evidence of operational monitoring.

## 2. Golden signals

| Signal | Measurement | Operational purpose |
|---|---|---|
| Latency | Payment duration, p95, p99, and requests within 1 second | Identify slow payment recording |
| Traffic | Eligible payment attempts per second | Quantify workload |
| Errors | Infrastructure failures and expected business conflicts separately | Distinguish outages from valid rejections |
| Saturation | PostgreSQL pool utilization and pending outbox events | Detect capacity and publication delays |

Expected HTTP 409 conflicts are not infrastructure failures. Correct payment recording is independent of later notification delivery.

## 3. Metrics by component

These are logical components of the documented payment journey, not claims that each is an independently deployed microservice.

### 3.1 Billing payment processing

| Metric | Type | Unit | Allowed labels |
|---|---|---|---|
| `billing_payment_requests_total` | Counter | requests | `operation`, `outcome` |
| `billing_payment_duration_seconds` | Histogram | seconds | `operation`, `outcome` |
| `billing_http_requests_total` | Counter | requests | `route`, `method`, `status_class` |

Approved payment values:

- `operation`: `record_payment`
- `outcome`: `success`, `conflict`, `error`
- `route`: `/api/v1/invoices/{id}/payments`
- `method`: `POST`
- `status_class`: `2xx`, `4xx`, `5xx`

Only eligible attempts enter `billing_payment_requests_total`. Correctly rejected business conflicts count as `conflict`; infrastructure failures count as `error`. The HTTP metric may include other response classes for diagnostic purposes.

### 3.2 Billing dependency instrumentation

| Metric | Type | Unit | Allowed labels |
|---|---|---|---|
| `billing_dependency_requests_total` | Counter | calls | `dependency`, `outcome` |
| `billing_dependency_duration_seconds` | Histogram | seconds | `dependency`, `outcome` |
| `billing_db_connections_in_use` | Gauge | connections | `pool` |
| `billing_db_connections_max` | Gauge | connections | `pool` |

Proposed values:

- `dependency`: `postgres`, `patients`, `rabbitmq`
- `outcome`: `success`, `error`
- `pool`: `billing`

Dependencies are based on the documented architecture. Actual synchronous calls must be verified before implementation.

### 3.3 Payment event publication

| Metric | Type | Unit | Allowed labels |
|---|---|---|---|
| `billing_outbox_pending_events` | Gauge | events | `event_type` |
| `billing_outbox_oldest_pending_age_seconds` | Gauge | seconds | `event_type` |

Approved value: `event_type="PaymentRecorded"`.

The age gauge reports the oldest unpublished event age, or zero when none is pending. A missing metric is not equivalent to zero. An independent telemetry-health check must detect absent samples.

This gauge supports the event-freshness SLO in `05-slo.md`. Its implementation depends on confirming the persistence and event-publication mechanism.

## 4. Cardinality estimate

The following counts describe the restricted HU-BIL-003 monitoring scope, not a verified production inventory.

| Metric | Label values | Maximum base series |
|---|---|---:|
| `billing_payment_requests_total` | 1 operation × 3 outcomes | 3 |
| `billing_payment_duration_seconds` | 1 × 3 outcomes | 3 |
| `billing_http_requests_total` | 1 route × 1 method × 3 classes | 3 |
| `billing_dependency_requests_total` | 3 dependencies × 2 outcomes | 6 |
| `billing_dependency_duration_seconds` | 3 × 2 outcomes | 6 |
| `billing_db_connections_in_use` | 1 pool | 1 |
| `billing_db_connections_max` | 1 pool | 1 |
| `billing_outbox_pending_events` | 1 event type | 1 |
| `billing_outbox_oldest_pending_age_seconds` | 1 event type | 1 |

Histograms create additional bucket, `_sum`, and `_count` series. With eight finite bucket boundaries plus `+Inf`, each histogram label combination creates 11 series. Thus, the payment histogram has at most 33 series and the dependency histogram has at most 66 under these assumptions.

The listed metrics represent 115 potential time series in total: 3 + 33 + 3 + 6 + 66 + 1 + 1 + 1 + 1. This estimate excludes extra deployment labels and instrumentation beyond the stated scope.

Never label metrics using patient IDs, invoice IDs, payment IDs, email addresses, trace IDs, correlation IDs, or idempotency keys. Use normalized route templates.

## 5. Latency histogram design

Recommended boundaries in seconds:

`0.05, 0.1, 0.25, 0.5, 1, 3, 5, +Inf`

- 50-250 ms: distinguish rapid processing from ordinary dependency overhead.
- 500 ms: early warning of noticeable payment delay.
- 1 second: exact threshold used by the CP6 latency SLO.
- 3 and 5 seconds: diagnose severe database waits and timeouts.
- `+Inf`: required cumulative histogram boundary.

These thresholds are initial design assumptions. They should be calibrated using actual staff experience and measured response times.

### Payment p95 latency

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

### Payment p99 latency

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

## 6. Traffic and errors

### Payment attempts per second

```promql
sum(rate(billing_payment_requests_total{
  operation="record_payment"
}[5m]))
```

### Infrastructure error ratio

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

### Expected business conflict rate

```promql
sum(rate(billing_payment_requests_total{
  operation="record_payment",outcome="conflict"
}[5m]))
```

### Requests completing within the 1-second SLO threshold

```promql
sum(increase(billing_payment_duration_seconds_bucket{
  operation="record_payment",
  outcome=~"success|conflict",le="1"
}[30d]))
/
clamp_min(
  sum(increase(billing_payment_duration_seconds_count{
    operation="record_payment",
    outcome=~"success|conflict"
  }[30d])),
  1
)
```

## 7. Saturation and event freshness

### PostgreSQL connection utilization

```promql
billing_db_connections_in_use{pool="billing"}
/
clamp_min(billing_db_connections_max{pool="billing"}, 1)
```

### Pending payment events

```promql
billing_outbox_pending_events{event_type="PaymentRecorded"}
```

### Oldest unpublished payment event age

```promql
billing_outbox_oldest_pending_age_seconds{
  event_type="PaymentRecorded"
}
```

### Event-freshness SLI over 30 days

```promql
avg_over_time(
  (
    billing_outbox_oldest_pending_age_seconds{
      event_type="PaymentRecorded"
    } <= bool 60
  )[30d:1m]
)
```

This proposed query assumes regular samples. Missing instrumentation must be detected separately and must not be treated as healthy.

## 8. Privacy and operational boundaries

Metric label values must be bounded and must not contain identifiers, free-text messages, credentials, payment-card data, or patient information.

Individual transactions should be investigated through access-controlled structured logs and trace context, as described in `02-log-contract.md`, not through high-cardinality metric labels.

The CP3 prototype implements only an in-memory counter and duration histogram. It does not export the Prometheus metrics defined here.

## 9. Documentation references

1. `07-api/contracts/openapi/billing-service.yaml` - Payment recording API and documented conflict outcomes.
2. `09-microservices/dependency-map.md` - Billing dependencies and infrastructure.
3. `09-microservices/communication-patterns.md` - Synchronous REST processing and asynchronous `PaymentRecorded` publication.

Related workshop evidence: `01-journey.md`, `02-log-contract.md`, `03-instrumentation/HOW-TO-RUN.md`, and `05-slo.md`.

## 10. Validation status

**Defined:** Golden signals, metric catalog by component, allowed labels, cardinality calculations, histogram boundaries, proposed PromQL, and event-freshness monitoring.

**Verified locally:** CP3 unit tests for its in-memory counter and duration histogram.

**Not verified:** Actual Billing backend instrumentation, Prometheus scraping, outbox implementation, production traffic, database utilization, or real service SLO measurements.
```
