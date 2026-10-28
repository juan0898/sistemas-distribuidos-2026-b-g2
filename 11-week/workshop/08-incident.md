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

For the illustrative scenario, a payment request may include a 3-second PostgreSQL call and still complete successfully.

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

The detailed calculation and synthetic sample will be incorporated in the next commit.

The estimate must use the hypothetical traffic assumptions from CP6 and distinguish expected averages from real transaction counts.

## 4. Simulated distributed trace

The illustrative trace, including parent-child spans and durations, will be incorporated in the next commit.

No production trace was captured.

## 5. Four correlated JSON logs

Four synthetic structured logs sharing one `trace_id` will be incorporated in the next commit.

No production logs or sensitive payment information are claimed.

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
| `BillingPaymentAvailabilityFastBurn` | Does not fire if payment requests succeed because no payment errors occur |
| `BillingPaymentAvailabilitySlowBurn` | Does not fire if payment requests succeed because no payment errors occur |
| `BillingPaymentDatabaseSaturation` | Cannot be determined without connection-pool utilization data |

The fast and slow availability alerts additionally require at least two errors within their configured long windows.

If some slow operations timed out, their effect would depend on actual timeout settings, error classifications, traffic, and the two alert windows. None of those failure counts is established by the scenario.

A 3-second database call alone is insufficient evidence of an HTTP 5xx response or a database saturation alert.

A separate latency alert is proposed as future work.

## 8. Error-budget assessment

For availability, CP6 proposes:

`810 monthly requests x 0.001 = 0.81 allowed failed requests`

When every payment succeeds:

`failed requests = 0`

`availability budget consumed by the successful sample = 0`

Slow requests may consume the latency budget even when the availability budget remains unaffected.

Actual monthly latency-budget consumption cannot be determined without observed 30-day request counts and durations.

For event freshness, no delayed-outbox measurements are available; its error-budget consumption cannot be calculated.

Detailed synthetic calculations will be incorporated in the next commit.

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

**Defined in this intermediate version:** Hypothetical timeline, SLO and alert assessment, postmortem, and three testable user stories.

**Pending for the next commit:** Detailed traffic estimates, synthetic sample, distributed trace, and four correlated JSON logs.

**Not performed:** Live fault injection, production metrics collection, real PostgreSQL testing, payment execution, or operational incident recovery.


