# CP6 - Service Level Objectives and Error Budgets

## 1. Scope and current implementation

**Team:** DI LUCCA Dental Care & Technology
**Domain:** Billing
**Journey:** Record an invoice payment (HU-BIL-003)
**Endpoint:** `POST /api/v1/invoices/{id}/payments`
**Measurement window:** Rolling 30 days

The Billing frontend currently uses static or in-memory demonstration data. It is not connected to a functional Billing backend or PostgreSQL database.

All SLOs, traffic estimates, and PromQL queries in this document are proposed for future production instrumentation. No real traffic or service reliability measurements are claimed.

## 2. Measurement rules

- HTTP 201 represents a successfully recorded payment.
- Documented HTTP 409 business conflicts are correct service decisions, not infrastructure failures.
- HTTP 400 and 401 are excluded from eligible payment operations.
- HTTP 5xx and infrastructure-related failures consume the availability error budget.
- A committed payment remains successful even if a later notification fails.
- Timeouts require transaction-outcome verification before retrying.
- Metric labels must use bounded values and normalized routes.

The proposed Prometheus metrics are documented in `04-metrics.md`.

## 3. Three proposed SLOs

| SLO | SLI | Target | Window |
|---|---|---|---|
| Availability | Correct payment outcomes / eligible payment requests | 99.9% | 30 days |
| Latency | Eligible completed requests within 1 second / eligible completed requests | 95% | 30 days |
| Event freshness | Minutes with `PaymentRecorded` outbox age at most 60 seconds / observed minutes | 99% | 30 days |

The third SLO covers asynchronous event publication rather than repeating the HTTP availability indicator.

## 4. SLO 1 - Payment availability

**Target:** 99.9% over a rolling 30-day window.

**Formula:**

`availability = (success + conflict) / (success + conflict + error)`

A documented business conflict counts as a correct response when the service applies the intended business rule.

**Proposed PromQL:**

```promql
1 -
(
  (sum(increase(billing_payment_requests_total{
    operation="record_payment",outcome="error"
  }[30d])) or vector(0))
  /
  clamp_min(
    sum(increase(billing_payment_requests_total{
      operation="record_payment"
    }[30d])),
    1
  )
)
```

**Allowed error budget:** `1 - 0.999 = 0.001 = 0.1%`.

The outcome metric must consistently classify eligible attempts as `success`, `conflict`, or `error`. Invalid client requests must not enter this denominator.

## 5. SLO 2 - Payment latency

**Target:** At least 95% of eligible completed requests finish within 1 second.

**Formula:**

`latency_sli = eligible_requests_at_most_1s / eligible_completed_requests`

**Proposed PromQL:**

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

The histogram measures synchronous processing until the authoritative HTTP response. Asynchronous email delivery is excluded.

**Allowed latency budget:** 5% of eligible completed requests may exceed 1 second.

The 1-second threshold is a design assumption, not an observed user requirement.

## 6. SLO 3 - Payment event freshness

**Target:** The oldest pending `PaymentRecorded` outbox event is at most 60 seconds old during 99% of observed minutes.

**Formula:**

`freshness_sli = healthy_observed_minutes / total_observed_minutes`

**Additional proposed metric:**

`billing_outbox_oldest_pending_age_seconds{event_type="PaymentRecorded"}`

This metric must be added to the CP4 catalog. It should report zero when no events are pending and must not use event IDs as labels.

**Proposed PromQL:**

```promql
avg_over_time(
  (
    billing_outbox_oldest_pending_age_seconds{
      event_type="PaymentRecorded"
    } <= bool 60
  )[30d:1m]
)
```

**Allowed freshness budget:** 1% of observed minutes.

This SLO can fail even when payment requests return HTTP 201, making it operationally different from availability.

Missing telemetry must be detected separately; missing samples must not silently count as healthy.

## 7. Justified traffic estimate

The following assumptions are illustrative, not clinic measurements.

| Assumption | Value | Rationale |
|---|---:|---|
| Dentists | 4 | Hypothetical small-clinic capacity |
| Appointments per dentist per day | 8 | Hypothetical working-day workload |
| Appointments generating a payment | 70% | Planning assumption |
| Payment attempts per payment | 1.2 | Allows for retries or conflicts |
| Days in modeled month | 30 | Simplified SLO calculation |

**Estimated daily requests:**

`4 × 8 × 0.70 × 1.2 = 26.88 ≈ 27 requests/day`

**Estimated 30-day requests:**

`27 × 30 = 810 requests`

This simplified model assumes the same activity every day. Real clinic schedules and demand may differ.

## 8. Error budgets in numbers

| SLO | Calculation | Illustrative budget |
|---|---|---|
| Availability | 810 × 0.001 | 0.81 failed requests |
| Latency | 810 × 0.05 | 40.5 slow requests |
| Event freshness | 43,200 × 0.01 | 432 unhealthy minutes |

Because failures are discrete, the availability example permits zero complete failed requests before exceeding the modeled budget. This illustrates how restrictive a 99.9% target is at low volume.

**Availability time equivalent:**

`30 × 24 × 60 = 43,200 minutes`

`43,200 × 0.001 = 43.2 minutes`

The 43.2-minute value is an equivalent continuous-outage illustration, not an additional allowance to the request-based budget. Actual consumption depends on traffic and failed requests.

Real error budgets must be recalculated using measured volume and actual outcomes.

## 9. Error-budget response policy

| Consumed budget | Proposed team action |
|---|---|
| 50% | Review error codes in the daily meeting; assign a Billing investigation |
| 75% | Prioritize reliability tasks and limit risky payment-related releases |
| 100% | Freeze nonessential payment feature releases until recovery and review |

For the illustrative availability budget of 0.81 failed requests, even one failed eligible request exceeds 100%. Percentages are therefore more useful with longer observation periods or higher actual traffic.

The Billing service owner coordinates application investigation; the infrastructure owner reviews database and messaging risks. These are proposed responsibilities, not verified assignments.

## 10. Relationship with alerting

`06-alerts.yml` uses the same 99.9% availability objective:

- Fast burn: `14.4 × 0.001 = 0.0144` (1.44% error ratio).
- Slow burn: `6 × 0.001 = 0.006` (0.6% error ratio).

Both alerts need minimum-volume safeguards because the estimated payment traffic is low.

The event freshness SLO needs separate monitoring before deployment.

## 11. Documentation references

1. `07-api/contracts/openapi/billing-service.yaml` - HU-BIL-003, payment recording and HTTP conflict handling.
2. `09-microservices/dependency-map.md` - Billing dependencies, PostgreSQL and RabbitMQ.
3. `09-microservices/communication-patterns.md` - REST payment processing, outbox publication and asynchronous `PaymentRecorded` events.

Related evidence: `01-journey.md`, `04-metrics.md`, `06-alerts.yml`, and `07-runbook.md`.

## 12. Validation status

**Defined:** three distinct SLOs, PromQL expressions, justified hypothetical traffic, error budgets and operational policies.

**Not validated:** actual request rates, service latency, outbox event freshness, Prometheus evaluation or production error budgets.

All numerical examples are hypothetical.
