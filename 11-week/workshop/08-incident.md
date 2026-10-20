
# CP9 - Billing Payment Incident Simulation

## 1. Incident overview

**Team:** DI LUCCA Dental Care & Technology  
**Domain:** Billing  
**Journey:** Record an invoice payment (HU-BIL-003)  
**Incident type:** Simulated dependency latency degradation  
**Duration:** 40 minutes  
**Status:** Hypothetical exercise; no production incident occurred.
**Current implementation:** The Billing frontend currently uses static or in-memory demonstration data. It is not connected to a functional Billing backend or PostgreSQL database. The dependency slowdown described in this document is a hypothetical scenario, not an incident observed in the application.

### Scenario

During a 40-minute period, 25% of calls to a synchronous dependency take 3 seconds. For this exercise, the affected dependency is assumed to be PostgreSQL during payment processing.

This dependency choice is a simulation assumption, not an observed Billing failure.

The remaining 75% of dependency calls are assumed to behave normally, but their exact response times are unknown.

## 2. Expected impact

The critical journey requires validation and an authoritative payment transaction before returning the HTTP response.

Potential consequences include:

- Increased payment request latency.
- Payment requests exceeding the proposed 1-second latency objective.
- Connection-pool pressure if operations occupy resources longer.
- Possible request timeouts if configured limits are exceeded.
- Repeated submissions if operators do not know the transaction outcome.

A slow dependency call does not automatically imply a failed payment.

The simulation does not specify request volume, timeout configuration, or baseline latency. Therefore, the number of failed payments and the actual error rate cannot be calculated.

## 3. SLO impact assessment

| Proposed SLO | Target | Expected risk |
|---|---|---|
| Availability | 99.9% over 30 days | At risk only if requests fail or time out |
| Latency | 95% within 1 second | Likely affected by 3-second dependency calls |
| Reliability | 99.95% over 30 days | At risk if infrastructure failures prevent commits |

If each slow call belongs to one distinct eligible payment request, and no other delays are present, at least those affected requests would exceed 1 second.

This is a conditional illustration, not a measured 25% end-to-end latency violation.

No actual monthly error-budget consumption can be determined without request counts and outcomes.

## 4. Simulated incident timeline

| Time | Event |
|---|---|
| T+00 | Simulated dependency latency degradation begins |
| T+05 | Payment latency dashboard would show elevated durations if instrumented |
| T+10 | Operator starts checking traces, logs, and database pressure |
| T+15 | Team investigates connection usage and slow transactions |
| T+20 | Team reviews safe mitigation and avoids blind payment retries |
| T+30 | Team checks whether timeouts or failed transactions occurred |
| T+40 | Injected latency condition ends |
| T+45 | Team verifies payment consistency and pending events |
| T+60 | Hypothetical incident review and follow-up planning |

These are illustrative exercise milestones, not recorded timestamps.

## 5. Detection and alert evaluation

Useful signals from `04-metrics.md` include:

- `billing_payment_duration_seconds` for payment latency.
- `billing_dependency_duration_seconds` for dependency latency.
- `billing_db_connections_in_use` for database pressure.
- `billing_payment_requests_total` for payment outcomes.

The `BillingPaymentAvailabilityFastBurn` and `BillingPaymentAvailabilitySlowBurn` alerts are based on payment error ratios, not latency alone.

**Neither burn-rate alert is guaranteed to fire** in this scenario because the exercise describes slow calls but does not establish failed requests.

The database saturation alert fires only if connection utilization exceeds 85% for its configured duration.

A dedicated latency SLO alert would be a useful future addition.

## 6. Investigation and mitigation

1. Confirm the time window and affected payment operation.
2. Review latency histograms and request traffic.
3. Correlate payment logs using trace identifiers.
4. Identify slow database calls and long-running transactions.
5. Review PostgreSQL connection-pool usage.
6. Check timeout settings and recent deployment changes.
7. Avoid retrying uncertain payment transactions without verifying their outcome.
8. Coordinate safe mitigation with the responsible service owner.
9. Verify invoices, payment records, and asynchronous events.
10. Document evidence and outstanding risks.

The exercise does not claim that any command was executed against a real database.

## 7. Postmortem - hypothetical findings

**Summary:** A simulated slowdown affected one synchronous dependency during payment recording.

**Trigger:** Artificial 3-second latency applied to 25% of dependency calls.

**Potential contributing factors:**

- Synchronous payment processing depends on database response time.
- Long-running calls can increase resource occupation.
- Insufficient latency alerting could delay diagnosis.

**What helped in the exercise:**

- The payment journey identified the critical synchronous boundary.
- The proposed metric catalog identified relevant latency and saturation signals.
- The runbook outlined safe investigation and recovery steps.

**Remaining uncertainty:** No actual trace capture, database measurement, payment failure count, or incident response time was observed.

## 8. Improvement backlog - three user stories
