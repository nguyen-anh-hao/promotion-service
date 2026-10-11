'use strict';

// OpenTelemetry bootstrap for the promotion service. Loaded via
// `node --require ./tracing.js` so the SDK and auto-instrumentations are
// registered before NestJS/Express start accepting requests.

const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { BatchLogRecordProcessor } = require('@opentelemetry/sdk-logs');
const { Resource } = require('@opentelemetry/resources');

const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318';

const sdk = new NodeSDK({
  resource: new Resource({
    'service.name': process.env.OTEL_SERVICE_NAME || 'promotion-service',
  }),
  traceExporter: new OTLPTraceExporter({ url: endpoint + '/v1/traces' }),
  logRecordProcessors: [
    new BatchLogRecordProcessor(new OTLPLogExporter({ url: endpoint + '/v1/logs' })),
  ],
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

process.on('SIGTERM', () => {
  sdk.shutdown().then(
    () => process.exit(0),
    () => process.exit(1),
  );
});
