
# CP7 — Billing Payment Alert Policy

## 1. Purpose and scope

**Team:** DI LUCCA Dental Care & Technology  
**Domain:** Billing  
**Critical journey:** Record an invoice payment (HU-BIL-003)

This policy describes the proposed response to alerts affecting the Billing payment-recording journey.

It complements:

- `05-slo.md` — service level objectives and error budgets.
- `06-alerts.yml` — proposed Prometheus alerting rules.
- `04-metrics.md` — metric definitions and PromQL queries.

**Implementation status:** This is an academic proposal. The alert rules are not deployed, and no production on-call schedule or notification channel has been confirmed.

## 2. Alert classification

| Alert | Severity | Trigger | Proposed response |
|---|---|---|---|
| BillingPaymentAvailabilityFastBurn | Critical | Error ratio above 1.44% over 1h and 5m | Investigate immediately |
| BillingPaymentAvailabilitySlowBurn | Warning | Error ratio above 0.6% over 6h and 30m | Investigate sustained failures |
| BillingPaymentDatabaseSaturation | Warning | Database pool utilization above 85% for 10m | Review connection pressure |

The burn-rate thresholds are derived from the proposed 99.9% availability SLO:

- Error budget: `1 - 0.999 = 0.001`.
- Fast burn: `14.4 × 0.001 = 0.0144`, or 1.44%.
- Slow burn: `6 × 0.001 = 0.006`, or 0.6%.

These values are alerting thresholds, not observed failure rates.

## 3. Proposed responsibilities

| Role | Responsibility |
|---|---|
| Billing service owner | Investigate payment processing failures |
| Infrastructure operator | Check PostgreSQL, deployment, and monitoring availability |
| Incident coordinator | Coordinate response and communicate impact |
| Documentation owner | Record evidence, timeline, and follow-up actions |

These are functional responsibilities rather than confirmed assignments to specific team members.

## 4. Critical alert response

For `BillingPaymentAvailabilityFastBurn`:

1. Acknowledge the alert and record its start time.
2. Check the payment error ratio and request volume.
3. Inspect correlated structured logs and trace identifiers.
4. Distinguish HTTP 5xx failures from expected HTTP 409 conflicts.
5. Check PostgreSQL connectivity and recent deployments.
6. Consider pausing risky changes while investigating.
7. Escalate to the appropriate service or infrastructure owner.
8. Record findings and recovery evidence.

**Proposed acknowledgment target:** within 5 minutes.

This response target is not an existing operational commitment.

## 5. Warning alert response

For `BillingPaymentAvailabilitySlowBurn`:

1. Confirm that the condition persists in both alert windows.
2. Review error trends and recent application changes.
3. Check whether failures affect particular dependencies.
4. Estimate error-budget consumption.
5. Plan a corrective action before the condition worsens.

**Proposed acknowledgment target:** within 30 minutes.

For `BillingPaymentDatabaseSaturation`:

1. Check active database connections and configured pool limits.
2. Review payment request volume and connection acquisition delays.
3. Investigate slow queries or transactions holding connections.
4. Verify that connections are released correctly.
5. Coordinate capacity or application changes when necessary.

Do not increase database connection limits without evaluating PostgreSQL capacity.

## 6. Alert routing and escalation

Proposed routing:

- `critical` alerts: notify the responsible Billing and infrastructure operators.
- `warning` alerts: create a tracked investigation for the responsible team.
- Unacknowledged critical alerts: escalate to the incident coordinator.
- Repeated warnings: review trends and consider a reliability improvement task.

No email address, paging platform, or on-call rotation is assumed to exist.

## 7. Noise reduction and safety

- Require both long and short burn-rate windows before firing.
- Apply the `for` durations defined in `06-alerts.yml`.
- Avoid alerts based on individual invoice or patient identifiers.
- Investigate low-traffic periods before trusting ratios.
- Group related alerts by service and journey.
- Do not suppress critical payment failures solely because another alert is firing.

The current expressions do not include an explicit minimum-request-volume gate. A future production configuration should evaluate one to reduce low-volume noise.

## 8. Recovery and closure criteria

Close an incident only after:

1. The relevant alert condition has cleared.
2. Payment processing has been verified through authorized checks.
3. Error rates and latency have returned to acceptable levels.
4. Any affected payment transactions have been reviewed for consistency.
5. Evidence, timeline, and follow-up actions have been documented.

A cleared alert alone does not prove that every affected payment was correctly recorded.

## 9. Documentation alignment

The policy is informed by:

1. `07-api/contracts/openapi/billing-service.yaml` — payment recording, HTTP 201 and 409 responses, and business conflict rules.
2. `09-microservices/dependency-map.md` — Billing dependencies, including PostgreSQL and RabbitMQ.
3. `09-microservices/communication-patterns.md` — synchronous REST operations, asynchronous payment events, and independent notification handling.

## 10. Validation status

**Defined:** alert severities, proposed response targets, functional responsibilities, escalation, and closure criteria.

**Not validated:** Prometheus evaluation, alert notification delivery, on-call readiness, response-time compliance, or real incidents.
s
