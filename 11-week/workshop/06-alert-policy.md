# CP7 - Billing Payment Alert Policy

## 1. Purpose and scope

**Team:** DI LUCCA Dental Care & Technology  
**Domain:** Billing  
**Critical journey:** Record an invoice payment (HU-BIL-003)  
**Endpoint:** `POST /api/v1/invoices/{id}/payments`

This policy defines proposed alert response, error-budget consumption, escalation, and noise-reduction rules for Billing.

Related evidence: `04-metrics.md`, `05-slo.md`, `06-alerts.yml`, and `07-runbook.md`.

**Implementation status:** Academic design only. Alerts, notification channels, and on-call procedures have not been deployed or verified.

## 2. Availability SLO and burn rates

The proposed availability SLO is 99.9% over a rolling 30-day window.

- Allowed error ratio: `1 - 0.999 = 0.001` (0.1%).
- Fast burn: `14.4 x 0.001 = 0.0144` (1.44%).
- Slow burn: `6 x 0.001 = 0.006` (0.6%).

Only eligible infrastructure-related payment failures consume this budget. Documented business conflicts are correct outcomes, not server failures.

## 3. Alert classification

| Alert | Severity | Windows | Trigger |
|---|---|---|---|
| BillingPaymentAvailabilityFastBurn | Critical | 1h and 5m | Error ratio > 1.44%; at least 2 errors in 1h |
| BillingPaymentAvailabilitySlowBurn | Warning | 6h and 30m | Error ratio > 0.6%; at least 2 errors in 6h |
| BillingPaymentDatabaseSaturation | Warning | 10m | PostgreSQL pool utilization > 85% |

Both availability alerts require their long and short windows to exceed the threshold simultaneously.

The saturation alert is diagnostic. It does not directly represent error-budget consumption.

## 4. Error-budget consumption at firing thresholds

A 30-day window contains:

`30 x 24 = 720 hours`

The idealized budget fraction consumed at a constant burn rate is:

`consumption = burn_rate x incident_duration / 720 hours`

| Alert | Rate | Long window | Approximate 30-day budget consumed |
|---|---:|---:|---:|
| Fast burn | 14.4x | 1 hour | 2% |
| Slow burn | 6x | 6 hours | 5% |

For the fast alert:

`14.4 x 1 / 720 x 100 = 2%`

For the slow alert:

`6 x 6 / 720 x 100 = 5%`

These are theoretical consumption levels at the threshold, not measured incident results. The actual percentage may be higher when the observed error ratio exceeds the threshold.

The short windows confirm that the problem is continuing. They do not replace the long-window budget calculation.

## 5. Traffic assumptions and noise reduction

CP6 estimates approximately 27 eligible payment attempts per day and 810 over 30 days. These are hypothetical values, not production measurements.

With low traffic, one error can generate an unusually high percentage. Therefore:

- Fast burn requires at least 2 errors in 1h.
- Slow burn requires at least 2 errors in 6h.
- Both alerts require their respective long and short error-ratio conditions.
- The evaluation duration is 2 minutes for fast burn and 5 minutes for slow burn.
- Alerts must never use patient, invoice, payment, or trace identifiers as labels.

The two-error gates reduce alert noise but can delay detection when traffic is very low. They are initial design decisions that require calibration using actual request volume.

A single failed eligible payment should still be visible through metrics and incident investigation, even when neither alert fires.

Missing telemetry must be monitored separately; an absent time series is not proof of healthy service operation.

## 6. Proposed recipients and communication channels

| Severity | Responsible role | Proposed channel | Expected action |
|---|---|---|---|
| Critical | Billing service owner and infrastructure operator | Team emergency notification channel | Immediate investigation |
| Warning: slow burn | Billing service owner | Issue tracker and team channel | Tracked reliability investigation |
| Warning: saturation | Infrastructure operator | Issue tracker and team channel | Check connection pressure |

The emergency notification channel and issue tracker are proposed communication mechanisms, not confirmed integrations.

**Proposed acknowledgment targets:**

- Critical: 5 minutes.
- Warning: 30 minutes.

If a critical alert remains unacknowledged, the incident coordinator should be notified through the agreed team process.

No specific operator, rotation, paging service, or notification address is assumed to exist.

## 7. Fast-burn response

When `BillingPaymentAvailabilityFastBurn` fires:

1. Record the alert timestamp and current error ratio.
2. Verify the request volume and the two-error condition.
3. Inspect structured logs and correlated `trace_id` values.
4. Separate expected HTTP 409 business conflicts from infrastructure errors.
5. Investigate PostgreSQL connectivity and recent deployment changes.
6. Assess whether payment completion is uncertain after any timeout.
7. Coordinate low-risk mitigation with the appropriate owner.
8. Record incident evidence and reassess the remaining error budget.

Follow the proposed steps in `07-runbook.md`.

Do not automatically repeat payment requests with uncertain outcomes.

## 8. Slow-burn and saturation response

For `BillingPaymentAvailabilitySlowBurn`:

1. Confirm both 6h and 30m windows exceed the threshold.
2. Review error codes, traffic, latency, and dependency failures.
3. Estimate accumulated budget consumption.
4. Create a reliability task and assign a responsible role.
5. Escalate if payment processing deteriorates.

For `BillingPaymentDatabaseSaturation`:

1. Review connections in use and maximum pool capacity.
2. Investigate slow queries and long-lived transactions.
3. Compare connection pressure with actual payment latency and errors.
4. Coordinate corrective action with the infrastructure owner.

Do not increase PostgreSQL connection limits without evaluating database capacity.

## 9. Two cause-based alerts intentionally excluded

### CPU utilization above 90%

A high CPU reading does not necessarily mean payment recording is failing.

It may be useful for diagnosis but should not automatically page the Billing owner without evidence of user impact.

### RabbitMQ queue depth above a fixed threshold

A temporary queue increase can be normal during asynchronous processing and does not prove that payment recording is unavailable.

A fixed queue-depth threshold is therefore excluded from the primary paging policy. Event publication should instead be evaluated with the proposed freshness SLO in `05-slo.md`.

Both signals may support investigation, but the primary availability alerts focus on failed payment operations.

## 10. Error-budget operational policy

| Consumed 30-day budget | Proposed action |
|---|---|
| 50% | Review failures in the daily meeting and assign an investigation |
| 75% | Prioritize reliability improvements and restrict risky payment changes |
| 100% | Freeze nonessential payment feature releases pending recovery and review |

These actions are proposed. They are not existing release controls.

The CP6 example allows only 0.81 failed requests over 810 hypothetical requests. One eligible infrastructure failure would already exceed that illustrative availability budget.

This low-volume behavior should be considered when calibrating the SLO and alert policy.

## 11. Validation and recovery

Before production deployment, validate the YAML with:

`promtool check rules 11-week/workshop/06-alerts.yml`

Also test the PromQL expressions with synthetic request counters, including normal behavior, one failure, two failures, missing metrics, and low-volume periods.

This validation command is a proposed procedure; successful execution is not claimed here.

Close an incident only when:

1. Relevant alert conditions have cleared.
2. Authorized payment checks confirm expected behavior.
3. Error and latency indicators have recovered.
4. Ambiguous payment outcomes have been investigated.
5. The timeline, evidence, and follow-up actions are documented.

## 12. Documentation references

1. `07-api/contracts/openapi/billing-service.yaml` - Payment recording and documented HTTP business conflicts.
2. `09-microservices/dependency-map.md` - Billing infrastructure dependencies.
3. `09-microservices/communication-patterns.md` - Synchronous payment processing and asynchronous event publication.

## 13. Validation status

**Defined:** Burn-rate thresholds, budget calculations, recipients by role, proposed channels, two excluded cause-based alerts, traffic safeguards, and recovery conditions.

**Not validated:** Prometheus rules execution, real request volumes, production paging, acknowledgment times, notification delivery, or operational recovery.

