# CP8 - Billing Payment Incident Runbook

## 1. Purpose and scope

**Team:** DI LUCCA Dental Care & Technology  
**Domain:** Billing  
**Critical journey:** Record an invoice payment (HU-BIL-003)  
**Endpoint:** `POST /api/v1/invoices/{id}/payments`

This runbook describes proposed detection, investigation, mitigation, escalation, and recovery procedures for the Billing payment-recording journey.

**Implementation status:** Academic operational design. The Billing frontend currently uses demonstration data. Production payment processing, PostgreSQL monitoring, Prometheus alerting, and centralized tracing have not been validated.

The procedures below are not evidence of an operational production environment.

## 2. Incident triggers and ownership

| Trigger | Severity | Initial owner |
|---|---|---|
| `BillingPaymentAvailabilityFastBurn` | Critical | Billing service owner |
| `BillingPaymentAvailabilitySlowBurn` | Warning | Billing service owner |
| `BillingPaymentDatabaseSaturation` | Warning | Infrastructure operator |
| Payment outcome uncertain after timeout | Assess immediately | Billing service owner |
| Delayed `PaymentRecorded` publication | Assess event impact | Billing and messaging owners |

The infrastructure operator supports database and messaging investigations. The incident coordinator manages escalation and communications. These are proposed roles, not confirmed staff assignments.

**Proposed acknowledgment targets:** 5 minutes for critical alerts and 30 minutes for warnings.

## 3. First-response checklist

1. Record the alert name, detection time, and affected journey.
2. Assign the responsible role and record who acknowledged the incident.
3. Identify whether errors, latency, or publication delays affect users.
4. Verify request volume before interpreting percentages.
5. Compare the 1h/5m and 6h/30m alert conditions.
6. Inspect structured logs using `trace_id` and `correlation_id`.
7. Check dependencies and recent application changes.
8. Preserve evidence before applying a mitigation.

Do not include patient names, credentials, authentication tokens, payment-card details, or sensitive transaction payloads in incident records.

## 4. Diagnosis - PromQL queries

PromQL queries for payment traffic, availability burn rates, latency, PostgreSQL saturation, and `PaymentRecorded` event freshness will be incorporated in the next commit.

The proposed metrics and thresholds are defined in `04-metrics.md`, `05-slo.md`, and `06-alerts.yml`.

Production Prometheus instrumentation is not currently available.

## 5. Diagnosis - Logs and trace correlation

Use the structured logging fields from `02-log-contract.md`.

Example simulated investigation:

1. Identify the `trace_id` associated with a failed payment.
2. Find all records sharing that identifier.
3. Sort those records by timestamp.
4. Follow the request through payment validation and dependency access.
5. Identify the first failure and distinguish it from later consequences.

Example illustrative log search for a local JSON-lines export:

```powershell
Get-Content .\billing-logs.jsonl | Select-String '"trace_id":"0123456789abcdef0123456789abcdef"'
```

The example file is not part of the deployed system. Use this command only if an appropriately redacted local log export exists.

Do not assume a payment failed because its HTTP response timed out. The database transaction might already have committed.

## 6. Diagnosis - Payment outcomes

| Outcome | Interpretation | Action |
|---|---|---|
| HTTP 201 | Payment recorded | Verify invoice and payment state if needed |
| HTTP 409 | Documented business rejection | Inspect error code; do not count as infrastructure failure |
| HTTP 5xx | Server or dependency failure | Investigate application and infrastructure |
| Timeout | Transaction result uncertain | Verify authoritative state before retrying |

Relevant documented conflicts include `STALE_VERSION`, `IDEMPOTENCY_CONFLICT`, `INVOICE_NOT_PAYABLE`, and `PAYMENT_EXCEEDS_BALANCE`.

Never bypass concurrency protections, edit balances manually, or retry an uncertain payment without confirmation of its previous result.

## 7. Dependency investigation

| Dependency | Diagnostic question |
|---|---|
| PostgreSQL | Are connections exhausted, queries blocked, or transactions delayed? |
| Authentication | Are valid requests being authorized correctly? |
| Patients | Is a documented dependency failing? |
| Outbox / RabbitMQ | Are committed `PaymentRecorded` events pending publication? |
| Notification worker | Are messages failing after payment commit? |

Confirm the actual synchronous and asynchronous paths against the project documentation before modifying any dependency.

A notification delivery failure must not reverse a committed payment.

## 8. Three mitigations ordered by risk

### Mitigation 1 - Low risk: stabilize and investigate

**Owner:** Billing service owner.

- Pause nonessential payment-related deployments.
- Record failing operations, metrics, logs, and recent changes.
- Preserve transaction state without attempting unsafe retries.

**Verification:** No additional risky change is introduced; the incident timeline and affected operations are identified.

This is a proposed coordination action that does not require a deployed rollback mechanism.

### Mitigation 2 - Medium risk: controlled application correction

**Owner:** Billing service owner with infrastructure support.

- Identify whether a recent deployment caused the regression.
- Prepare a correction or rollback only if an authorized, tested deployment procedure exists.
- Validate the expected payment behavior and error indicators afterward.

**Verification:** The affected operation passes authorized checks without duplicate payments or invoice inconsistency.

**Current limitation:** A production Billing rollback procedure has not been demonstrated in this workshop.

### Mitigation 3 - High risk: dependency or event recovery

**Owner:** Infrastructure and Billing service owners.

- Investigate PostgreSQL availability, locks, and connection limits.
- Recover messaging or pending events only using verified, idempotent mechanisms.
- Reconcile payment and event state before considering any replay.

**Verification:** Payment records remain consistent, required events are published once logically, and no unintended duplicate effect occurs.

**Current limitation:** Database recovery, outbox replay, and message-reprocessing procedures are proposals, not verified operational capabilities.

Never increase connection limits blindly or manually replay a payment transaction with an uncertain outcome.

## 9. Escalation procedure

1. **Critical alert:** Billing service owner investigates immediately; infrastructure operator assists if a dependency is involved.
2. **Unacknowledged critical alert:** Notify the incident coordinator after the proposed five-minute acknowledgment target.
3. **Persistent warning:** Create an assigned reliability investigation and review impact.
4. **Uncertain payment consistency:** Escalate before performing retries, database changes, or event reprocessing.
5. **Missing monitoring data:** Investigate telemetry availability separately from application health.

Channels, incident ownership, and response times remain proposed until approved by the team.

## 10. Measurable recovery criteria

Recovery should be assessed using these proposed checks:

| Check | Recovery condition |
|---|---|
| Availability | Recent eligible errors return to zero or an explicitly accepted baseline |
| Alert state | Fast/slow burn conditions clear after their configured windows |
| Latency | Recent completed payments meet the 1-second threshold at an acceptable rate |
| PostgreSQL | Connection utilization returns below 85%, if saturation caused the incident |
| Event freshness | Oldest pending `PaymentRecorded` event age is at most 60 seconds |
| Consistency | All affected payment outcomes are reconciled with invoice state |
| Documentation | Recovery time, evidence, and follow-up owner are recorded |

The 30-day SLOs in `05-slo.md` are assessed separately. Historical error-budget consumption does not disappear immediately after service recovery.

With very low traffic, successful synthetic checks or authorized transaction verification may be necessary because recent ratios can be inconclusive.

Do not close an incident based only on a cleared alert. Confirm payment consistency and unresolved event-delivery risks.

## 11. Evidence and handoff

Record:

- Detection, acknowledgment, mitigation, and recovery timestamps.
- Alert name, sample counts, error ratios, and relevant durations.
- Redacted `trace_id` references and associated error codes.
- Dependency findings and mitigation decisions.
- Verification evidence and unresolved risks.
- Follow-up issue, responsible role, and acceptance criteria.

The incident report in `08-incident.md` must identify simulated evidence as hypothetical.

## 12. References and validation status

**Related workshop evidence:** `01-journey.md`, `02-log-contract.md`, `04-metrics.md`, `05-slo.md`, `06-alerts.yml`, `06-alert-policy.md`, and `08-incident.md`.

**Architecture references:** `07-api/contracts/openapi/billing-service.yaml`, `09-microservices/dependency-map.md`, and `09-microservices/communication-patterns.md`.

**Defined:** Operational diagnosis, log correlation, three risk-ordered mitigations, escalation, and recovery checks.

**Pending in this intermediate version:** Detailed PromQL diagnostic queries.

**Not validated:** Production instrumentation, real alert delivery, deployed log search, backend payments, operational rollback, outbox recovery, and real incident response.
