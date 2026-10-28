# CP9 - Billing Payment Incident Simulation

## 1. Incident overview

**Team:** DI LUCCA Dental Care & Technology  
**Domain:** Billing  
**Critical journey:** Record an invoice payment (HU-BIL-003)  
**Endpoint:** `POST /api/v1/invoices/{id}/payments`  
**Incident type:** Simulated synchronous dependency latency  
**Duration:** 40 minutes  
**Status:** Hypothetical academic exercise

The Billing frontend currently uses static or in-memory demonstration data. It is not connected to a functional payment backend or PostgreSQL instance.

No real incident, production fault injection, database measurement, or operational recovery occurred.

### Scenario

For 40 minutes, 25% of PostgreSQL dependency calls are assumed to take 3 seconds. The remaining 75% complete normally, with unspecified durations.

For the illustrative trace below, one payment request includes a 3-second PostgreSQL call and completes successfully in 3.2 seconds.

A slow call does not automatically mean a failed payment.

## 2. Connection with CP6

| SLO | Proposed target | Simulated impact |
|---|---|---|
| Availability | 99.9% correct outcomes over 30 days | No violation if slow requests still succeed |
| Latency | 95% completed within 1 second over 30 days | At risk because some calls take 3 seconds |
| Event freshness | 99% of observed minutes with oldest pending `PaymentRecorded` age <= 60 seconds | No proven impact without event-backlog data |

These SLOs match `05-slo.md`.

The 40-minute incident can cause short-term latency degradation without necessarily causing a 30-day SLO violation.

## 3. Estimated traffic and incident impact

CP6 uses these hypothetical clinic assumptions:

- Four dentists.
- Eight appointments per dentist per day.
- 70% of appointments generate a payment.
- 1.2 payment attempts per payment.
- Approximately 27 payment attempts per day.

Assuming uniform traffic across 24 hours:

`27 / 24 = 1.125 requests/hour`

For 40 minutes:

`1.125 x (40 / 60) = 0.75 expected requests`

Assuming one dependency call per payment attempt:

`0.75 x 0.25 = 0.1875 expected slow calls`

These fractional values are expected averages, not observed transaction counts. The real outcome during a particular 40-minute interval could be zero, one, or more requests.

The estimate also assumes uniform daily traffic, which is unlikely to represent actual clinic operating hours.

### Separate illustrative sample

To demonstrate the latency effect, consider a synthetic sample of 20 eligible payments, each using one PostgreSQL call:

| Outcome | Simulated count |
|---|---:|
| Payment requests | 20 |
| Slow dependency calls (25%) | 5 |
| Normal dependency calls (75%) | 15 |
| Successful HTTP responses | 20 |
| HTTP 5xx failures | 0 |

Assume the 15 normal requests finish within 1 second, while the five slow requests finish in 3.2 seconds.

The illustrative latency compliance is:

`15 / 20 = 75%`

This is below the proposed 95% latency objective for this sample, but it does not establish failure of the rolling 30-day SLO.

Availability for this sample is `20 / 20 = 100%`.

This separate sample is not claimed to represent the expected natural traffic during the 40-minute incident.

## 4. Simulated distributed trace

The following is an illustrative trace, not a captured production trace.

**Trace ID:** `0123456789abcdef0123456789abcdef`

```text
billing-api POST /api/v1/invoices/{id}/payments
| trace_id: 0123456789abcdef0123456789abcdef
| span_id: 1111111111111111
| duration: 3200 ms
|
+-- billing.validate_payment
|   span_id: 2222222222222222
|   parent: 1111111111111111
|   duration: 70 ms
|
+-- billing.postgresql.record_payment
|   span_id: 3333333333333333
|   parent: 1111111111111111
|   duration: 3000 ms
|
+-- billing.prepare_response
    span_id: 4444444444444444
    parent: 1111111111111111
    duration: 30 ms
```

The remaining 100 ms represent illustrative processing overhead outside the listed child spans.

The database span explains most of the simulated request duration. The payment still returns HTTP 201.

Actual span propagation and backend instrumentation are not implemented in this workshop.

## 5. Four correlated JSON logs

All four examples use the same 32-character `trace_id` and an illustrative correlation ID.

These records are synthetic and contain no patient names, credentials, card numbers, or payment payloads.

### Log 1 - Request received

```json
{"timestamp":"2026-10-27T14:00:00.000Z","level":"INFO","service":"billing","trace_id":"0123456789abcdef0123456789abcdef","span_id":"1111111111111111","correlation_id":"billing-demo-001","operation":"record_payment","event":"payment.request.received"}
```

### Log 2 - Payment validation completed

```json
{"timestamp":"2026-10-27T14:00:00.070Z","level":"INFO","service":"billing","trace_id":"0123456789abcdef0123456789abcdef","span_id":"2222222222222222","correlation_id":"billing-demo-001","operation":"record_payment","event":"payment.validation.completed","duration_ms":70}
```

### Log 3 - Slow PostgreSQL operation

```json
{"timestamp":"2026-10-27T14:00:03.070Z","level":"WARN","service":"billing","trace_id":"0123456789abcdef0123456789abcdef","span_id":"3333333333333333","correlation_id":"billing-demo-001","operation":"record_payment","dependency":"postgres","event":"dependency.slow_call","duration_ms":3000}
```

### Log 4 - Payment request completed

```json
{"timestamp":"2026-10-27T14:00:03.200Z","level":"INFO","service":"billing","trace_id":"0123456789abcdef0123456789abcdef","span_id":"1111111111111111","correlation_id":"billing-demo-001","operation":"record_payment","event":"payment.request.completed","http_status":201,"duration_ms":3200}
```

A responder would filter by `trace_id`, order by timestamp, and identify the 3000 ms PostgreSQL span as the main latency contributor.

The JSON examples are proposed diagnostic records, not proof of deployed logging.

## 6. Simulated incident timeline

| Time | Hypothetical activity |
|---|---|
| T+00 | Dependency degradation begins |
| T+05 | Latency measurements begin showing elevated values, if traffic occurs |
| T+10 | Billing owner reviews request counts and duration histograms |
| T+15 | Database spans and structured logs are correlated |
| T+20 | PostgreSQL saturation and recent changes are investigated |
| T+25 | Team considers low-risk mitigation |
| T+30 | Payment outcomes and possible timeouts are reviewed |
| T+40 | Simulated degradation ends |
| T+45 | Payment consistency and event freshness are checked |
| T+60 | Postmortem and improvement backlog are prepared |

These milestones represent planned exercise activities, not measured response times.

## 7. Alert evaluation

The alert rules are defined in `06-alerts.yml`.

| Alert | Evaluation under this scenario |
|---|---|
| `BillingPaymentAvailabilityFastBurn` | Does not fire in the all-success sample because no payment errors occur |
| `BillingPaymentAvailabilitySlowBurn` | Does not fire in the all-success sample because no payment errors occur |
| `BillingPaymentDatabaseSaturation` | Cannot be determined without connection-pool utilization data |

The fast and slow availability alerts additionally require at least two errors within their configured long windows.

If some slow operations timed out, their effect would depend on actual timeout settings, error classifications, traffic, and the two alert windows. None of those failure counts is established by the scenario.

A 3-second database call alone is insufficient evidence of an HTTP 5xx response or a database saturation alert.

A separate latency alert is proposed as future work.

## 8. Error-budget assessment

For availability, CP6 proposes:

`810 monthly requests x 0.001 = 0.81 allowed failed requests`

In the illustrative all-success sample:

`failed requests = 0`

`availability budget consumed by sample = 0`

For the proposed latency SLO, the synthetic sample has five slow requests out of 20. Its local violation rate is 25%, above the 5% target allowance.

However, this does not provide the actual monthly latency-budget consumption because 30-day request counts and outcomes are unknown.

For event freshness, no delayed-outbox measurements are available; its error-budget consumption cannot be calculated.

The purpose of this section is to distinguish measured, assumed, and unknown values.

## 9. Investigation and mitigation

Following `07-runbook.md`:

1. Verify payment traffic and the duration histogram.
2. Check the fast and slow availability error ratios.
3. Search correlated logs by `trace_id`.
4. Identify the slow PostgreSQL span.
5. Review connection-pool utilization and dependency failures.
6. Verify authoritative payment and invoice state.
7. Check pending `PaymentRecorded` event age.
8. Avoid repeating payments with uncertain outcomes.
9. Record evidence and responsible roles.

### Risk-ordered mitigations

**Low risk:** Pause nonessential deployments, preserve evidence, and investigate the dependency.

**Medium risk:** Prepare an authorized application correction or rollback only if a tested procedure exists.

**High risk:** Recover a failing database or pending-event mechanism only through verified, idempotent operational procedures.

The workshop has not demonstrated production rollback, database recovery, or event replay.

## 10. Postmortem

**Incident classification:** Hypothetical dependency latency degradation.

**Trigger:** Assumed 3-second PostgreSQL calls affecting 25% of dependency operations.

**User impact:** Potentially slower payment confirmation. No demonstrated payment loss or duplicate charge.

**Probable mechanism:** A synchronous database operation extends end-to-end payment duration.

**Detection gap:** The two configured burn-rate alerts track failures rather than successful but slow payments.

**What worked in the exercise:** The proposed trace, bounded metrics, and log correlation identify where latency accumulates.

**What remains unverified:** Real database behavior, timeouts, volume, monitoring, event publication, and recovery actions.

**Preventive decision:** Prioritize dependency-latency visibility and safe transaction-outcome verification before production rollout.

## 11. Improvement backlog

### HU-OBS-001 - Dependency latency visibility

As a Billing operator, I want bounded-label dependency histograms so that I can identify slow PostgreSQL payment operations.

**Given** a simulated payment dependency call,  
**When** its duration is recorded,  
**Then** the metric exposes seconds-based histogram buckets and counts using only approved bounded labels.

**Given** a payment request containing sensitive identifiers,  
**When** the dependency metric is emitted,  
**Then** invoice IDs, payment IDs, patient IDs, and trace IDs are not used as metric labels.

### HU-OBS-002 - Sustained latency alert

As an incident responder, I want sustained latency alerting so that payment degradation is detected before availability fails.

**Given** sufficient eligible payment traffic,  
**When** the proportion of responses exceeding 1 second remains above the configured threshold for the required windows,  
**Then** a warning is generated with a link to the Billing runbook.

**Given** insufficient request volume,  
**When** the latency percentage becomes unstable,  
**Then** the alert follows an explicitly documented low-volume safeguard.

The precise warning thresholds and evaluation windows require a separate design review; they are not implemented in CP7.

### HU-OBS-003 - Safe payment recovery verification

As a Billing operator, I want authoritative outcome verification so that uncertain responses do not cause duplicate payments.

**Given** a payment operation ending in a timeout,  
**When** an operator investigates the transaction,  
**Then** the existing payment and invoice state is verified before any retry.

**Given** an already committed payment,  
**When** the operator reviews asynchronous processing,  
**Then** pending `PaymentRecorded` publication and idempotency guarantees are checked without recording the payment again.

## 12. Documentation and validation

**Architecture references:**

1. `07-api/contracts/openapi/billing-service.yaml` - HU-BIL-003 payment recording.
2. `09-microservices/dependency-map.md` - Billing dependencies.
3. `09-microservices/communication-patterns.md` - REST and asynchronous events.

**Workshop evidence:** `01-journey.md`, `02-log-contract.md`, `04-metrics.md`, `05-slo.md`, `06-alerts.yml`, `06-alert-policy.md`, and `07-runbook.md`.

**Completed:** Hypothetical timeline, illustrative trace, four correlated logs, conditional impact calculations, SLO and alert assessment, postmortem, and three testable user stories.

**Not performed:** Live fault injection, production metrics collection, real PostgreSQL testing, payment execution, or operational incident recovery.

