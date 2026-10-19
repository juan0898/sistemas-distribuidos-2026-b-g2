
<!-- WEEK 11 - CP2: STRUCTURED LOGGING CONTRACT
     Project: DI LUCCA Dental Care & Technology
     Domain: Billing
     Journey: HU-BIL-003 - Record an invoice payment -->

# CP2 - Structured Logging Contract

## 1. Context and objective

| Field | Value |
|---|---|
| Project | DI LUCCA Dental Care & Technology |
| Domain | Billing |
| User story | HU-BIL-003 |
| Journey | Record an invoice payment |
| Endpoint | POST /api/v1/invoices/{id}/payments |
| Operation | BillingRecordpayment |
| Format | JSON Lines (one JSON object per log entry) |

Define a proposed structured logging contract for the
Billing payment journey documented in `01-journey.md`.

The examples are illustrative; they are not evidence
that logging has already been deployed.

## 2. Required common fields

| Field | Type | Purpose |
|---|---|---|
| timestamp | string | UTC timestamp in ISO 8601 format |
| level | string | DEBUG, INFO, WARN, or ERROR |
| service | string | Component emitting the log |
| version | string | Deployed service version |
| environment | string | dev, qa, or prod |
| trace_id | string | Distributed trace identifier |
| span_id | string | Current operation identifier |
| correlation_id | string | Business request correlation |
| event | string | Stable machine-readable event |
| message | string | Human-readable explanation |
| duration_ms | number | Elapsed operation time |

All fields must be present in emitted records.
Use `0` for duration_ms when timing is not applicable.

## 3. Billing domain fields

| Field | Type | Purpose |
|---|---|---|
| invoice_id | string | Invoice involved in the operation |
| payment_id | string/null | Payment identifier, if created |
| expected_version | number | Version supplied by the client |
| payment_method | string | Internal payment method category |
| http_status | number | HTTP outcome, when applicable |
| error_code | string/null | Stable business or dependency error |

Never use patient names, email addresses, session
tokens, or payment credentials as log labels.

## 4. Log levels and event names

| Level | Use case | Example event |
|---|---|---|
| DEBUG | Development-only diagnostics | billing.invoice.locked |
| INFO | Normal business operation | billing.payment.received |
| INFO | Successful financial commit | billing.payment.committed |
| WARN | Recoverable dependency failure | patients.lookup.timeout |
| WARN | Expected business rejection | billing.payment.rejected |
| ERROR | Unhandled or exhausted failure | billing.payment.failed |

A business-rule rejection is not automatically
an application error requiring ERROR severity.

## 5. Seven correlated JSON log examples

All seven records represent one illustrative
payment request. The same trace_id and
correlation_id connect the operations.

A Patients lookup is included only for a case
where pre-commit validation requires owner data.
The first lookup times out; its retry succeeds.
Billing then rejects the payment because the
amount exceeds the outstanding invoice balance.

```json
{"timestamp":"2026-10-19T15:00:00Z","level":"INFO","service":"api-gateway","version":"1.0.0","environment":"dev","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"00f067aa0ba902b7","correlation_id":"pay-demo-001","event":"billing.payment.requested","message":"Payment request routed","duration_ms":0,"invoice_id":"inv-101","payment_id":null,"expected_version":3,"payment_method":"CASH","http_status":0,"error_code":null}
{"timestamp":"2026-10-19T15:00:01Z","level":"INFO","service":"billing-service","version":"1.0.0","environment":"dev","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"b7ad6b7169203331","correlation_id":"pay-demo-001","event":"billing.payment.received","message":"Payment command accepted for validation","duration_ms":4,"invoice_id":"inv-101","payment_id":null,"expected_version":3,"payment_method":"CASH","http_status":0,"error_code":null}
{"timestamp":"2026-10-19T15:00:01Z","level":"INFO","service":"billing-service","version":"1.0.0","environment":"dev","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"0f7e3c2d4a6b8c90","correlation_id":"pay-demo-001","event":"billing.authorization.allowed","message":"Staff permission validated","duration_ms":12,"invoice_id":"inv-101","payment_id":null,"expected_version":3,"payment_method":"CASH","http_status":0,"error_code":null}
{"timestamp":"2026-10-19T15:00:04Z","level":"WARN","service":"billing-service","version":"1.0.0","environment":"dev","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"1a2b3c4d5e6f7081","correlation_id":"pay-demo-001","event":"patients.lookup.timeout","message":"Private Patients request timed out","duration_ms":3000,"invoice_id":"inv-101","payment_id":null,"expected_version":3,"payment_method":"CASH","http_status":0,"error_code":"DEPENDENCY_TIMEOUT"}
{"timestamp":"2026-10-19T15:00:04Z","level":"INFO","service":"billing-service","version":"1.0.0","environment":"dev","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"2b3c4d5e6f708192","correlation_id":"pay-demo-001","event":"patients.lookup.recovered","message":"Required validation lookup succeeded on retry","duration_ms":90,"invoice_id":"inv-101","payment_id":null,"expected_version":3,"payment_method":"CASH","http_status":0,"error_code":null}
{"timestamp":"2026-10-19T15:00:04Z","level":"WARN","service":"billing-service","version":"1.0.0","environment":"dev","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"3c4d5e6f708192a3","correlation_id":"pay-demo-001","event":"billing.payment.rejected","message":"Payment exceeds outstanding invoice balance","duration_ms":16,"invoice_id":"inv-101","payment_id":null,"expected_version":3,"payment_method":"CASH","http_status":409,"error_code":"PAYMENT_EXCEEDS_BALANCE"}
{"timestamp":"2026-10-19T15:00:04Z","level":"INFO","service":"api-gateway","version":"1.0.0","environment":"dev","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"00f067aa0ba902b7","correlation_id":"pay-demo-001","event":"billing.payment.response","message":"Payment request completed with business rejection","duration_ms":3200,"invoice_id":"inv-101","payment_id":null,"expected_version":3,"payment_method":"CASH","http_status":409,"error_code":"PAYMENT_EXCEEDS_BALANCE"}
```

The durations and service versions are sample values,
not measurements from the running application.

## 6. Privacy and masking policy

- Never log passwords, tokens, cookies, or credentials.
- Never log patient contact details or medical records.
- Do not log raw payment request or response bodies.
- Use opaque invoice_id and payment_id identifiers.
- Avoid payment amounts and financial details in logs.
- Mask sensitive values before serialization.
- Restrict production log access by authorized role.
- Use bounded retention and environment separation.

## 7. Correlation and propagation rules

- Accept or create a valid W3C traceparent context.
- Preserve trace_id across Gateway and Billing spans.
- Create a new span_id for each instrumented operation.
- Propagate context through authorized private REST.
- Carry trace context in RabbitMQ message headers.
- Link worker logs to the originating payment trace.
- Use correlation_id for business-level investigation.
- Do not use invoice_id as the distributed trace ID.

## 8. Documentation references

- `dlc-docs/07-api/contracts/openapi/billing-service.yaml`
- `dlc-docs/09-microservices/dependency-map.md`
- `dlc-docs/09-microservices/communication-patterns.md`
- `dlc-docs/09-microservices/services/06-billing-service/README.md`

## 9. CP2 validation

- [x] Required common log fields defined
- [x] At least four Billing domain fields defined
- [x] Seven JSON examples with shared trace_id
- [x] Dependency timeout represented
- [x] Business-rule rejection represented
- [x] Log levels and privacy policy documented
- [x] Real project documentation referenced
- [ ] Git commit and push recorded
```
