
const TRACEPARENT_PATTERN =
  /^00-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/;

const DURATION_BUCKETS_MS = [50, 100, 250, 500, 1000, 3000, 5000];

export function parseTraceparent(header) {
  if (typeof header !== 'string') return null;

  const match = TRACEPARENT_PATTERN.exec(header.trim());
  if (!match) return null;

  const [, traceId, parentSpanId, flags] = match;

  if (
    traceId === '0'.repeat(32) ||
    parentSpanId === '0'.repeat(16)
  ) {
    return null;
  }

  return {
    trace_id: traceId,
    parent_span_id: parentSpanId,
    trace_flags: flags,
  };
}

export function formatTraceparent(context, flags = '01') {
  const traceId = context?.trace_id;
  const spanId = context?.span_id;

  if (
    typeof traceId !== 'string' ||
    typeof spanId !== 'string' ||
    !/^[0-9a-f]{32}$/.test(traceId) ||
    !/^[0-9a-f]{16}$/.test(spanId) ||
    traceId === '0'.repeat(32) ||
    spanId === '0'.repeat(16) ||
    !/^[0-9a-f]{2}$/.test(flags)
  ) {
    throw new Error('Invalid trace context');
  }

  return `00-${traceId}-${spanId}-${flags}`;
}

export function createPaymentMetrics() {
  const requests = new Map();
  const durations = new Map();

  function validateLabels(operation, outcome) {
    const allowedOperations = ['record_payment'];
    const allowedOutcomes = ['success', 'conflict', 'error'];

    if (
      !allowedOperations.includes(operation) ||
      !allowedOutcomes.includes(outcome)
    ) {
      throw new Error('Unsupported metric labels');
    }
  }

  function record({ operation, outcome, duration_ms }) {
    validateLabels(operation, outcome);

    if (
      typeof duration_ms !== 'number' ||
      !Number.isFinite(duration_ms) ||
      duration_ms < 0
    ) {
      throw new Error('Invalid duration');
    }

    const key = `${operation}:${outcome}`;
    requests.set(key, (requests.get(key) ?? 0) + 1);

    const histogram = durations.get(key) ?? {
      count: 0,
      sum_ms: 0,
      buckets: DURATION_BUCKETS_MS.map(() => 0),
    };

    histogram.count += 1;
    histogram.sum_ms += duration_ms;

    DURATION_BUCKETS_MS.forEach((boundary, index) => {
      if (duration_ms <= boundary) {
        histogram.buckets[index] += 1;
      }
    });

    durations.set(key, histogram);
  }

  function snapshot() {
    return {
      duration_buckets_ms: [...DURATION_BUCKETS_MS],
      requests: Object.fromEntries(requests),
      durations: Object.fromEntries(
        [...durations].map(([key, value]) => [
          key,
          {
            count: value.count,
            sum_ms: value.sum_ms,
            buckets: [...value.buckets],
          },
        ]),
      ),
    };
  }

  return { record, snapshot };
}
