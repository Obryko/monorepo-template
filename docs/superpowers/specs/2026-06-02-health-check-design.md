# Health Check Design

**Date:** 2026-06-02
**Status:** Approved

## Summary

Extend `packages/observability/src/nest/` with `HealthModule` — a `@nestjs/terminus`-based health check module exposed as part of the `@monorepo-template/observability/nest` entrypoint. Apps register it alongside `ObservabilityModule` to expose a `GET /health` endpoint with memory checks by default and optional custom indicators.

---

## Package Structure

New file added to existing `packages/observability`:

```
packages/observability/src/nest/
  health.module.ts    ← new
```

`packages/observability/src/nest/index.ts` updated to re-export `HealthModule`.

---

## Module Contract

```ts
interface HealthModuleOptions {
  indicators?: HealthIndicatorFunction[]
  memoryHeapThreshold?: number  // bytes, default 314572800 (300MB)
  memoryRssThreshold?: number   // bytes, default 314572800 (300MB)
}

HealthModule.forRoot(options?: HealthModuleOptions): DynamicModule
```

Registers:
1. `TerminusModule` from `@nestjs/terminus`
2. `HealthController` — `GET /health` returns Terminus standard JSON:
   ```json
   { "status": "ok", "info": { "memory_heap": { "status": "up" } }, "error": {}, "details": {} }
   ```
3. Default checks: `MemoryHealthIndicator` for heap and RSS
4. Consumer-supplied `indicators` appended after defaults

**Response codes:** `200` when healthy, `503` when any check fails.

---

## App Wiring

```ts
// apps/api/src/app.module.ts
import { HealthModule, ObservabilityModule } from '@monorepo-template/observability/nest'

@Module({
  imports: [
    ObservabilityModule.forRoot({ serviceName: 'api', logLevel: env.LOG_LEVEL }),
    HealthModule.forRoot(),
  ],
})
export class AppModule {}
```

```ts
// apps/api/src/main.ts — /health excluded from /api prefix
app.setGlobalPrefix('api', { exclude: ['metrics', 'health'] })
```

---

## Dependencies

### Peer (optional, for `./nest` subpath)
```
@nestjs/terminus: >=10.0.0
```

Added to `peerDependencies` (optional) and `devDependencies` in `packages/observability/package.json`.

---

## Error Handling

- If any indicator throws, Terminus catches it and returns `503` with the error detail.
- `HealthModule.forRoot()` with no arguments works — memory checks require no external services.

---

## Testing

- `apps/api` e2e test: `GET /health` returns `200` with `status: "ok"` and `memory_heap` info.
