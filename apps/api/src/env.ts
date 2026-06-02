import {
  createEnv,
  nodeEnvSchema,
  otelEndpointSchema,
  otelServiceVersionSchema,
  portSchema,
  z,
} from '@monorepo-template/env'
import { loadExistingEnvFiles } from '@monorepo-template/env/node'

if (process.env.NODE_ENV !== 'production') {
  loadExistingEnvFiles(['apps/api/.env.local', 'apps/api/.env'])
}

export const env = createEnv({
  server: {
    NODE_ENV: nodeEnvSchema,
    PORT: portSchema.default(3001),
    CORS_ORIGIN: z.string().url().default('http://localhost:3000'),
    LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
    OTEL_EXPORTER_OTLP_ENDPOINT: otelEndpointSchema,
    OTEL_SERVICE_VERSION: otelServiceVersionSchema,
    THROTTLE_TTL: z.coerce.number().default(60000),
    THROTTLE_LIMIT: z.coerce.number().default(60),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
