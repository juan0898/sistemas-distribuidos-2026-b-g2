
# CP8 — Billing Payment Incident Runbook

## 1. Purpose and scope

**Team:** DI LUCCA Dental Care & Technology  
**Domain:** Billing  
**Critical journey:** Record an invoice payment (HU-BIL-003)  
**Endpoint:** `POST /api/v1/invoices/{id}/payments`

This runbook proposes procedures for detecting, investigating, mitigating, and recovering from failures affecting payment recording.

**Status:** Academic operational guide. The Billing backend, Prometheus alerts, and production tracing have not been integrated or validated.

## 2. Incident triggers

| Signal | Possible problem | Initial priority |
|---|---|---|
| `BillingPaymentAvailabilityFastBurn` | Rapid payment error-budget consumption | Critical |
| `BillingPaymentAvailabilitySlowBurn` | Sustained payment failures | Warning |
| `BillingPaymentDatabaseSaturation` | PostgreSQL connection pressure | Warning |
| Unexpected HTTP 5xx | Internal or dependency failure | Assess impact |
| Repeated HTTP 409 | Concurrency or idempotency conflicts | Investigate pattern |

A documented HTTP 409 response is not automatically an infrastructure incident.

## 3. First-response checklist

1. Record the alert name, detection time, and affected journey.
2. Identify the responsible Billing and infrastructure contacts.
3. Confirm whether payment recording is currently affected.
4. Review request traffic, error ratio, and latency.
5. Check recent deployments or configuration changes.
6. Inspect structured logs using trace and correlation identifiers.
7. Identify the failing dependency or application operation.
8. Record findings before applying mitigation.

Never include patient names, authentication tokens, or sensitive payment information in incident notes.

## 4. Diagnosis: payment processing failure

### Step A — Verify the HTTP outcome

- HTTP 201: payment recording succeeded.
- HTTP 409: inspect documented business conflicts.
- HTTP 5xx: investigate application and dependency failures.
- Timeout: verify whether the payment committed before retrying.

Do not assume a timeout means the payment was not recorded.

### Step B — Inspect trace and log context

Search the proposed structured logs for:

- `trace_id` and `correlation_id`
- payment operation and event name
- HTTP status and error code
- duration and dependency failure information

Correlate related operations using the same trace ID.

The CP3 prototype demonstrates these fields locally but does not provide a deployed trace collector or searchable production logs.

### Step C — Check dependencies

| Dependency | Diagnostic question |
|---|---|
| PostgreSQL | Are connections exhausted or transactions blocked? |
| Authentication | Is the request authorized correctly? |
| Patients | Is a required patient interaction failing? |
| RabbitMQ / outbox | Are committed payment events awaiting publication? |
| Notification worker | Did email delivery fail after the payment committed? |

Use the dependency map to distinguish required synchronous steps from asynchronous follow-up work.

## 5. Scenario: HTTP 409 business conflict

Check the error code:

- `STALE_VERSION`: the invoice version is outdated.
- `IDEMPOTENCY_CONFLICT`: the idempotency key conflicts with another request.
- `INVOICE_NOT_PAYABLE`: the invoice is not in a payable state.
- `PAYMENT_EXCEEDS_BALANCE`: the amount exceeds the remaining balance.

Actions:

1. Confirm the error corresponds to the documented business rule.
2. Review the request outcome without exposing sensitive data.
3. Avoid changing invoice balances manually.
4. Explain the valid corrective action to the authorized operator.
5. Escalate unexpected conflict spikes for investigation.

Do not bypass invoice concurrency or idempotency protections.

## 6. Scenario: PostgreSQL saturation or timeout

1. Review `billing_db_connections_in_use` and configured capacity.
2. Inspect connection acquisition delays and long transactions.
3. Check whether payment operations are holding locks.
4. Review recent traffic spikes and application changes.
5. Coordinate safe mitigation with the infrastructure owner.
6. Verify payment consistency before considering any retry.

Never increase connection limits blindly or rerun an uncertain payment without checking its existing outcome.

## 7. Scenario: event or notification failure

After a payment has committed:

1. Confirm the authoritative payment and invoice state.
2. Check whether `PaymentRecorded` was persisted for publication.
3. Inspect outbox backlog and RabbitMQ connectivity.
4. Check notification worker failures separately.
5. Use approved retry mechanisms only after verifying idempotency.
6. Record delayed events or notifications for follow-up.

A failed notification must not reverse a successfully committed payment.

## 8. Mitigation and escalation

- Pause risky deployments if critical payment failures continue.
- Involve the Billing service owner for application issues.
- Involve infrastructure support for PostgreSQL or messaging failures.
- Preserve logs, timestamps, and trace identifiers.
- Document any operational action and its observed result.
- Escalate if the cause is unknown or consistency is uncertain.

These are proposed responsibilities, not an established on-call procedure.

## 9. Recovery verification

Before closing the incident:

1. Confirm the alert condition has cleared.
2. Verify authorized payment requests complete as expected.
3. Check latency and error trends against the proposed SLOs.
4. Verify invoice balances and payment records are consistent.
5. Check pending events and delayed notifications.
6. Record the recovery time and supporting evidence.
7. Open follow-up tasks for unresolved risks.

Alert recovery alone does not prove transactional consistency.

## 10. Documentation references

1. `07-api/contracts/openapi/billing-service.yaml` — payment recording endpoint, HTTP responses, and documented conflict codes.
2. `09-microservices/dependency-map.md` — Billing service dependencies and infrastructure.
3. `09-microservices/communication-patterns.md` — synchronous processing, `PaymentRecorded` events, and notification separation.

Related workshop artifacts: `01-journey.md`, `02-log-contract.md`, `05-slo.md`, `06-alerts.yml`, and `06-alert-policy.md`.

## 11. Validation and limitations

**Defined:** incident triggers, diagnostic steps, safe mitigation, escalation, and recovery checks.

**Not validated:** production alert delivery, live PostgreSQL diagnostics, real message-queue recovery, and end-to-end payment incident response.

