
# CP6 — Service Level Objectives and Error Budgets

## 1. Scope

**Team:** DI LUCCA Dental Care & Technology  
**Domain:** Billing  
**Critical journey:** Record an invoice payment (HU-BIL-003)  
**Endpoint:** `POST /api/v1/invoices/{id}/payments`

This document proposes service level indicators (SLIs), service level objectives (SLOs), and error budgets for the Billing payment-recording journey.

The objectives are design targets, not measured production commitments. The Billing backend has not been instrumented or tested against these thresholds.

## 2. Measurement principles

- **Measurement window:** rolling 30 days.
- **Source:** future production HTTP and application metrics.
- **Eligible requests:** authorized, valid payment submissions reaching Billing.
- **Successful request:** a payment is recorded and the service returns HTTP 201.
- **Business rejection:** documented HTTP 409 conflicts are monitored separately when caused by valid business rules.
- **Service failure:** an eligible payment cannot be processed because of a server, dependency, or infrastructure problem.
- **Minimum traffic:** evaluate low-volume periods carefully to avoid misleading percentages.

A notification delivery failure after a committed payment is tracked separately. It must not retroactively classify a successfully recorded payment as a failed transaction.

## 3. Proposed SLOs

| SLO | Indicator (SLI) | Target over 30 days |
|---|---|---|
| Availability | Successful eligible payment requests / all eligible payment requests | 99.9% |
| Latency | Eligible payment requests completed within 1 second / all eligible completed payment requests | 95% |
| Reliability | Payment transactions completed without infrastructure-related failure / all eligible transaction attempts | 99.95% |

The values are proposed initial objectives and require calibration using real workload and historical measurements.

## 4. SLO 1 — Payment availability

**Target:** 99.9% of eligible payment requests complete successfully.

**SLI formula:**

`availability = successful_payment_requests / eligible_payment_requests`

The denominator includes eligible attempts affected by timeouts, HTTP 5xx responses, or unavailable dependencies.

Documented business-rule conflicts such as `STALE_VERSION`, `IDEMPOTENCY_CONFLICT`, and `PAYMENT_EXCEEDS_BALANCE` are excluded when they represent correct rejection of a request. Unexpected conflicts must be investigated rather than automatically excluded.

**30-day error budget:**

`1 - 0.999 = 0.001 = 0.1% of eligible requests`

For an illustrative volume of 100,000 eligible requests, the budget permits 100 unsuccessful requests.

This volume is hypothetical and is not based on observed Billing traffic.

## 5. SLO 2 — Payment latency

**Target:** At least 95% of eligible completed payment requests finish within 1 second.

**SLI formula:**

`latency_compliance = requests_duration_le_1s / eligible_completed_requests`

The duration is measured from Billing receiving a request to Billing sending the authoritative HTTP response.

It includes synchronous persistence and required validation, but excludes asynchronous notification delivery after the payment commits.

**30-day error budget:**

`1 - 0.95 = 0.05 = 5% of eligible completed requests`

For 100,000 hypothetical completed requests, up to 5,000 may exceed 1 second.

The latency threshold is a design proposal, not a verified benchmark.

## 6. SLO 3 — Payment reliability

**Target:** 99.95% of eligible payment transaction attempts complete without infrastructure-related failure.

**SLI formula:**

`reliability = transactions_without_infrastructure_failure / eligible_transaction_attempts`

A failed transaction includes unhandled database failures, dependency timeouts that prevent completion, and internal errors that stop an otherwise valid payment.

Correctly rejected business-rule conflicts do not count as infrastructure failures.

**30-day error budget:**

`1 - 0.9995 = 0.0005 = 0.05% of eligible attempts`

For 100,000 hypothetical transaction attempts, the budget permits 50 infrastructure-related failures.

Availability and reliability measure related outcomes and may overlap. Reliability is specifically scoped to the transaction's infrastructure-dependent processing.

## 7. Error-budget consumption and response

| Budget consumption | Proposed operational response |
|---|---|
| Below 25% | Continue normal delivery and review monitoring trends |
| 25%–50% | Investigate recurring failures and latency regressions |
| 50%–100% | Prioritize reliability improvements and increase release review |
| Above 100% | Pause nonessential risky releases and prioritize service recovery |

These responses are proposed policies, not existing team procedures.

Budget consumption is calculated as:

`observed_bad_events / permitted_bad_events`

An exhausted budget requires reviewing incidents, failed dependencies, tests, and monitoring coverage before resuming high-risk changes.

## 8. Prometheus implementation considerations

The proposed metrics in `04-metrics.md` would support request counts, duration buckets, and error ratios.

A production implementation must define consistent instrumentation at the Billing boundary, handle missing metric series, and distinguish expected business conflicts from infrastructure failures.

Percentile latency charts are useful for diagnosis, but the latency SLO should be evaluated using the fraction of requests satisfying the one-second threshold.

There are no production SLO results or measured error-budget values available in this workshop.

## 9. Documentation references

1. `07-api/contracts/openapi/billing-service.yaml` — HU-BIL-003, payment recording, HTTP 201 responses, and documented HTTP 409 business conflicts.
2. `09-microservices/dependency-map.md` — Billing dependencies such as PostgreSQL, authentication, Patients, and RabbitMQ.
3. `09-microservices/communication-patterns.md` — synchronous payment processing, asynchronous `PaymentRecorded` events, and independent notification handling.

Related evidence:

- `01-journey.md` — payment journey and failure boundaries.
- `03-instrumentation/HOW-TO-RUN.md` — scope of the tested prototype.
- `04-metrics.md` — golden signals, proposed metrics, and PromQL queries.

## 10. Validation status

**Defined:** three SLOs, measurement windows, eligibility criteria, error budgets, and operational responses.

**Not validated:** real production availability, latency distributions, transaction reliability, actual traffic volumes, and error-budget consumption.
