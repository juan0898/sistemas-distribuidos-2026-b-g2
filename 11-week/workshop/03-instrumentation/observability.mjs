
import { randomBytes } from 'node:crypto';

const newId = (bytes) => randomBytes(bytes).toString('hex');

const TRACE_ID_PATTERN = /^[a-f0-9]{32}$/;

export function createTraceContext(parentTraceId) {
  const trace_id =
    typeof parentTraceId === 'string' &&
    TRACE_ID_PATTERN.test(parentTraceId) &&
    parentTraceId !== '0'.repeat(32)
      ? parentTraceId
      : newId(16);

  return {
    trace_id,
    span_id: newId(8),
  };
}

const ALLOWED_FIELDS = new Set([
  'correlation_id',
  'message',
  'duration_ms',
  'invoice_id',
  'payment_id',
  'expected_version',
  'payment_method',
  'http_status',
  'error_code',
]);

const LEVELS = new Set(['DEBUG', 'INFO', 'WARN', 'ERROR']);

export function createStructuredLogger({
  service,
  version,
  environment,
  write = console.log,
}) {
  function emit(level, context, event, details = {}) {
    if (!LEVELS.has(level)) {
      throw new Error('Invalid log level');
    }

    const safeDetails = Object.fromEntries(
      Object.entries(details).filter(([key]) =>
        ALLOWED_FIELDS.has(key)
      )
    );

    const record = {
      timestamp: new Date().toISOString(),
      level,
      service,
      version,
      environment,
      trace_id: context.trace_id,
      span_id: context.span_id,
      correlation_id: null,
      event,
      message: '',
      duration_ms: 0,
      ...safeDetails,
    };

    write(JSON.stringify(record));
    return record;
  }

  return {
    debug: (context, event, details) =>
      emit('DEBUG', context, event, details),

    info: (context, event, details) =>
      emit('INFO', context, event, details),

    warn: (context, event, details) =>
      emit('WARN', context, event, details),

    error: (context, event, details) =>
      emit('ERROR', context, event, details),
  };
}
