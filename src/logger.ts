import pino from 'pino';
import { context, trace } from '@opentelemetry/api';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: {
    service_name: 'promotion-service',
    environment: process.env.APP_ENV || 'dev',
  },
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  mixin() {
    const span = trace.getSpan(context.active());
    if (span && span.isRecording()) {
      const sc = span.spanContext();
      return { trace_id: sc.traceId, span_id: sc.spanId };
    }
    return {};
  },
});
