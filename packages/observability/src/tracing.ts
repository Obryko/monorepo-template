import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'

export interface OtelSdkOptions {
  serviceName: string
  version?: string
  endpoint?: string
}

export function createOtelSdk(options: OtelSdkOptions): NodeSDK {
  const endpoint = options.endpoint ?? process.env['OTEL_EXPORTER_OTLP_ENDPOINT']
  const version = options.version ?? process.env['OTEL_SERVICE_VERSION']

  const resource = resourceFromAttributes({
    'service.name': options.serviceName,
    ...(version ? { 'service.version': version } : {}),
  })

  return new NodeSDK({
    resource,
    ...(endpoint ? { traceExporter: new OTLPTraceExporter({ url: endpoint }) } : {}),
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': { enabled: false },
      }),
    ],
  })
}
