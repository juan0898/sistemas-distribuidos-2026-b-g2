
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  parseTraceparent,
  formatTraceparent,
  createPaymentMetrics,
} from './telemetry.mjs';

const TRACE_ID = '0123456789abcdef0123456789abcdef';
const SPAN_ID = '0123456789abcdef';

test('formats a valid W3C traceparent header', () => {
  const header = formatTraceparent({
    trace_id: TRACE_ID,
    span_id: SPAN_ID,
  });

  assert.equal(
    header,
    `00-${TRACE_ID}-${SPAN_ID}-01`,
  );
});

test('parses an incoming W3C traceparent header', () => {
  const context = parseTraceparent(
    `00-${TRACE_ID}-${SPAN_ID}-01`,
  );

  assert.deepEqual(context, {
    trace_id: TRACE_ID,
    parent_span_id: SPAN_ID,
    trace_flags: '01',
  });
});

test('rejects invalid traceparent headers', () => {
  assert.equal(parseTraceparent(undefined), null);
  assert.equal(parseTraceparent('invalid'), null);

  assert.equal(
    parseTraceparent(`00-${'0'.repeat(32)}-${SPAN_ID}-01`),
    null,
  );

  assert.equal(
    parseTraceparent(`00-${TRACE_ID}-${'0'.repeat(16)}-01`),
    null,
  );
});

test('rejects invalid outgoing trace contexts', () => {
  assert.throws(
    () => formatTraceparent({
      trace_id: 'invalid',
      span_id: SPAN_ID,
    }),
    /Invalid trace context/,
  );

  assert.throws(
    () => formatTraceparent({
      trace_id: TRACE_ID,
      span_id: '0'.repeat(16),
    }),
    /Invalid trace context/,
  );
});

test('counts payment requests by outcome', () => {
  const metrics = createPaymentMetrics();

  metrics.record({
    operation: 'record_payment',
    outcome: 'success',
    duration_ms: 120,
  });

  metrics.record({
    operation: 'record_payment',
    outcome: 'success',
    duration_ms: 300,
  });

  metrics.record({
    operation: 'record_payment',
    outcome: 'conflict',
    duration_ms: 25,
  });

  const snapshot = metrics.snapshot();

  assert.equal(snapshot.requests['record_payment:success'], 2);
  assert.equal(snapshot.requests['record_payment:conflict'], 1);
});

test('records cumulative payment duration buckets', () => {
  const metrics = createPaymentMetrics();

  metrics.record({
    operation: 'record_payment',
    outcome: 'success',
    duration_ms: 120,
  });

  metrics.record({
    operation: 'record_payment',
    outcome: 'success',
    duration_ms: 300,
  });

  const histogram =
    metrics.snapshot().durations['record_payment:success'];

  assert.equal(histogram.count, 2);
  assert.equal(histogram.sum_ms, 420);
  assert.deepEqual(
    histogram.buckets,
    [0, 0, 1, 2, 2, 2, 2],
  );
});

test('rejects unapproved labels and invalid durations', () => {
  const metrics = createPaymentMetrics();

  assert.throws(
    () => metrics.record({
      operation: 'invoice_123',
      outcome: 'success',
      duration_ms: 100,
    }),
    /Unsupported metric labels/,
  );

  assert.throws(
    () => metrics.record({
      operation: 'record_payment',
      outcome: 'success',
      duration_ms: -1,
    }),
    /Invalid duration/,
  );

  assert.deepEqual(metrics.snapshot().requests, {});
});
