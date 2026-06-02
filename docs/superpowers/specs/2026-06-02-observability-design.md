# Observability Package Design

**Date:** 2026-06-02
**Status:** Approved

## Summary

Add `packages/observability` — a shared observability primitives package covering structured logging (Pino), distributed tracing (OpenTelemetry OTLP), Prometheus metrics, and correlation ID propagation. Exposes three entrypoints: base node primitives, a browser-safe subset, and an optional NestJS module. Apps wire it up in their own bootstrap; the package has no framework runtime deps in its main entrypoint.

---

## Package Structure

```
packages/observability/
  src/
    index.ts              # node primitives re-export
    correlation.ts        # traceparent + X-Request-ID helpers
    logger.ts             # Pino factory
    tracing.ts            # OTel NodeSDK builder
    metrics.ts            # prom-client registry
    fetch.ts              # traced fetch wrapper (browser-safe)
    browser/
      index.ts            # pino/browser + re-exports correlation + fetch
    nest/
      index.ts            # ObservabilityModule.forRoot()
      observability.module.ts
      metrics.controller.ts
      correlation.middleware.ts
  package.json
  tsconfig.json
  tsdown.config.ts
  biome.json
```

**Package name:** `@monorepo-template/observability`

**Exports in `package.json`:**

| Export path | Source | Use |
|---|---|---|
| `"."` | `src/index.ts` | Node-only primitives (API, web server) |
| `"./browser"` | `src/browser/index.ts` | Browser-safe subset (web client bundle) |
| `"./nest"` | `src/nest/index.ts` | NestJS module + peer deps |

---

## Module Contracts

### `src/correlation.ts`

```ts
generateCorrelationId(): string
// Returns a new W3C traceparent-format string: "00-{traceId}-{spanId}-01"

extractCorrelationId(headers: Record<string, string | string[] | undefined>): string
// Priority: traceparent header → x-request-id header → generateCorrelationId()

injectCorrelationHeaders(
  headers: Record<string, string>,
  correlationId: string,
): Record<string, string>
// Sets both "traceparent" and "x-request-id" to correlationId. Returns mutated headers.
```

### `src/logger.ts`

```ts
interface LoggerOptions {
  name: string
  level?: string  // defaults to process.env.LOG_LEVEL ?? 'info'
}

createLogger(options: LoggerOptions): pino.Logger
// Dev (NODE_ENV !== 'production'): pino-pretty transport
// Prod: raw JSON to stdout
```

### `src/tracing.ts`

```ts
interface OtelSdkOptions {
  serviceName: string
  version?: string        // defaults to process.env.OTEL_SERVICE_VERSION
  endpoint?: string       // defaults to process.env.OTEL_EXPORTER_OTLP_ENDPOINT
}

createOtelSdk(options: OtelSdkOptions): NodeSDK
// Auto-instruments: HTTP, Fastify, Pino
// OTLP HTTP exporter — if endpoint is undefined, tracing is a no-op (no export)
// Caller must: await sdk.start() BEFORE NestFactory.create / app bootstrap
```

### `src/metrics.ts`

```ts
createMetricsRegistry(): Registry
// Returns a prom-client Registry with collectDefaultMetrics() enabled.
// Caller mounts a /metrics HTTP handler that calls registry.metrics().
```

### `src/fetch.ts`

```ts
createTracedFetch(getCorrelationId: () => string): typeof fetch
// Returns a fetch wrapper that injects traceparent + x-request-id headers
// on every outgoing call. Browser-safe (no Node-only imports).
```

### `src/browser/index.ts`

```ts
createBrowserLogger(options: { name: string; level?: string }): pino.Logger
// pino/browser instance — browser-safe, no Node transports.

// Re-exports from parent:
export { createTracedFetch } from '../fetch'
export { generateCorrelationId, injectCorrelationHeaders, extractCorrelationId } from '../correlation'
```

### `src/nest/index.ts` — `ObservabilityModule`

```ts
interface ObservabilityModuleOptions {
  serviceName: string
  logLevel?: string      // defaults to LOG_LEVEL env var
  metricsPath?: string   // defaults to '/metrics'
}

ObservabilityModule.forRoot(options: ObservabilityModuleOptions): DynamicModule
```

Registers globally (no need to import per feature module):

1. **`LoggerModule`** from `nestjs-pino` — replaces NestJS default logger with Pino. All `Logger` injections use Pino.
2. **Correlation middleware** — applied to all routes; reads `traceparent` / `x-request-id`, stores in `AsyncLocalStorage`, adds `correlationId` to every Pino log within that request context.
3. **Fastify request hook** — logs `method`, `url`, `statusCode`, `responseTime` at `info` level on each request completion.
4. **`MetricsController`** — GET `{metricsPath}` returns `Content-Type: text/plain; version=0.0.4` with prom-client output.

**Peer dependencies** (not installed by the package, consumers must install):
```
nestjs-pino
pino-http
@nestjs/common
@nestjs/core
```

---

## Dependencies

### Runtime (in `packages/observability/package.json`)

```
pino
prom-client
@opentelemetry/sdk-node
@opentelemetry/auto-instrumentations-node
@opentelemetry/exporter-trace-otlp-http
@opentelemetry/resources
@opentelemetry/semantic-conventions
```

### Notes

- `pino-pretty` — keep as regular `dep`, not `devDep`; the dev logger transport loads it dynamically at runtime
- `pino/browser` — sub-export of `pino`, no separate install needed

### Peer (for `./nest` subpath)

```
nestjs-pino
pino-http
@nestjs/common
@nestjs/core
```

---

## New Env Vars (`packages/env/src/index.ts`)

```ts
export const otelEndpointSchema = z.url().optional()
export const otelServiceVersionSchema = z.string().optional()
```

Apps that use tracing add these to their own `createEnv()` server block:
```ts
OTEL_EXPORTER_OTLP_ENDPOINT: otelEndpointSchema,
OTEL_SERVICE_VERSION: otelServiceVersionSchema,
```

`OTEL_SERVICE_NAME` is structural config (passed directly in code), not a runtime env var.

---

## App Wiring

### `apps/api/src/main.ts` (bootstrap order is critical)

```ts
import { createOtelSdk } from '@monorepo-template/observability'
import { env } from './env.ts'

// OTel must start before NestFactory
const sdk = createOtelSdk({
  serviceName: 'api',
  version: env.OTEL_SERVICE_VERSION,
})
await sdk.start()

const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())
app.setGlobalPrefix('api')
await app.listen(env.PORT, '0.0.0.0')
```

### `apps/api/src/app.module.ts`

```ts
import { ObservabilityModule } from '@monorepo-template/observability/nest'

@Module({
  imports: [
    ObservabilityModule.forRoot({
      serviceName: 'api',
      logLevel: env.LOG_LEVEL,
    }),
  ],
})
export class AppModule {}
```

### `apps/web` — server-side (TanStack Start middleware or Nitro plugin)

```ts
import { extractCorrelationId, createTracedFetch } from '@monorepo-template/observability'
// Set up AsyncLocalStorage for correlation, call extractCorrelationId from request headers
// createTracedFetch injected into API calls
```

### `apps/web` — client-side

```ts
import { createTracedFetch, createBrowserLogger } from '@monorepo-template/observability/browser'
```

---

## Error Handling

- `createOtelSdk`: if `endpoint` is absent, NodeSDK is created with no exporter (tracing is local-only, no error thrown). This allows dev environments without an OTLP collector.
- `extractCorrelationId`: never throws; generates a new ID if headers are absent or malformed.
- `MetricsController`: if `registry.metrics()` throws, returns 500 with error message.
- Pino transport (pino-pretty): if `pino-pretty` is not installed, falls back to raw JSON silently.

---

## Testing

- `packages/observability`: unit tests for `correlation.ts` (extract/inject/generate), `logger.ts` (level defaults), `fetch.ts` (header injection).
- `apps/api`: existing e2e test extended to assert `x-request-id` response header is present and `/metrics` returns 200.
- `apps/web`: unit test for `createTracedFetch` in happy-dom environment.

---

## Out of Scope

- Log aggregation backend (Loki, CloudWatch) — apps configure their own Pino transports.
- Alerting rules — consumer responsibility.
- Metric business logic (e.g. "requests per user") — apps define their own prom-client counters on top of the registry.
- OpenTelemetry Metrics (separate from Prometheus) — Prometheus endpoint covers the use case.
