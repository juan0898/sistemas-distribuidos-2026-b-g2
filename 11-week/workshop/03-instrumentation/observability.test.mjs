

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createTraceContext,
  createStructuredLogger,
} from './observability.mjs';

const TRACE_ID_PATTERN = /^[a-f0-9]{32}$/;
const SPAN_ID_PATTERN = /^[a-f0-9]{16}$/;

test('creates valid W3C-compatible trace identifiers', () => {
  const context = createTraceContext();

  assert.match(context.trace_id, TRACE_ID_PATTERN);
  assert.match(context.span_id, SPAN_ID_PATTERN);
  assert.notEqual(context.trace_id, '0'.repeat(32));
  assert.notEqual(context.span_id, '0'.repeat(16));
});

test('creates different span identifiers for each operation', () => {
  const first = createTraceContext();
  const second = createTraceContext(first.trace_id);

  assert.equal(second.trace_id, first.trace_id);
  assert.notEqual(second.span_id, first.span_id);
});

test('emits a JSON log with the required CP2 fields', () => {
  const records = [];
  const logger = createStructuredLogger({
    service: 'billing-service',
    version: '0.1.0',
    environment: 'dev',
    write: (line) => records.push(JSON.parse(line)),
  });

  const context = createTraceContext();

  logger.info(context, 'billing.payment.received', {
    message: 'Payment validation started',
    correlation_id: 'pay-demo-001',
    duration_ms: 12,
    invoice_id: 'inv-101',
  });

  assert.equal(records.length, 1);

  const record = records[0];

  for (const field of [
    'timestamp',
    'level',
    'service',
    'version',
    'environment',
    'trace_id',
    'span_id',
    'correlation_id',
    'event',
    'message',
    'duration_ms',
  ]) {
    assert.ok(Object.hasOwn(record, field), `Missing: ${field}`);
  }

  assert.equal(record.level, 'INFO');
  assert.equal(record.event, 'billing.payment.received');
  assert.equal(record.trace_id, context.trace_id);
  assert.equal(record.invoice_id, 'inv-101');
});

test('correlates logs from separate operations', () => {
  const records = [];
  const logger = createStructuredLogger({
    service: 'billing-service',
    version: '0.1.0',
    environment: 'dev',
    write: (line) => records.push(JSON.parse(line)),
  });

  const request = createTraceContext();
  const validation = createTraceContext(request.trace_id);

  logger.info(request, 'billing.payment.received', {
    correlation_id: 'pay-demo-002',
  });

  logger.warn(validation, 'billing.payment.rejected', {
    correlation_id: 'pay-demo-002',
    error_code: 'PAYMENT_EXCEEDS_BALANCE',
  });

  assert.equal(records.length, 2);
  assert.equal(records[0].trace_id, records[1].trace_id);
  assert.notEqual(records[0].span_id, records[1].span_id);
  assert.equal(records[1].level, 'WARN');
});

test('excludes sensitive fields from structured logs', () => {
  const records = [];
  const logger = createStructuredLogger({
    service: 'billing-service',
    version: '0.1.0',
    environment: 'dev',
    write: (line) => records.push(line),
  });

  logger.info(createTraceContext(), 'billing.payment.received', {
    invoice_id: 'inv-101',
    token: 'secret-token',
    password: 'secret-password',
    patient_email: 'private@example.com',
    authorization: 'Bearer secret',
  });

  const output = records.join('\n');

  assert.ok(output.includes('inv-101'));
  assert.ok(!output.includes('secret-token'));
  assert.ok(!output.includes('secret-password'));
  assert.ok(!output.includes('private@example.com'));
  assert.ok(!output.includes('Bearer secret'));
});

