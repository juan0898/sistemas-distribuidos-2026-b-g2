
# CP4 ??? Golden Signals and Metrics Catalog

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

