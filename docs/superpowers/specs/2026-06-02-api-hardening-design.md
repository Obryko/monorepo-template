# API Hardening Design

**Date:** 2026-06-02
**Status:** Approved

## Summary

Add three production-readiness features to `apps/api`: OpenAPI documentation via Swagger (schemas derived from Zod contracts), rate limiting via `@nestjs/throttler`, and a global exception filter for consistent structured error responses.

---

## Changes

### 1. Swagger / OpenAPI

**Libraries:** `@nestjs/swagger`, `@fastify/swagger`, `@fastify/swagger-ui`, `zod-openapi`

**Endpoint:** `GET /api-docs` — Swagger UI (excluded from `/api` prefix)
**JSON spec:** `GET /api-docs/json`

**Wiring in `apps/api/src/main.ts`:**

```ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { patchNestJsSwagger } from 'zod-openapi' // patches NestJS to understand Zod schemas

patchNestJsSwagger()

const config = new DocumentBuilder()
  .setTitle('API')
  .setVersion('1.0')
  .build()
const document = SwaggerModule.createDocument(app, config)
SwaggerModule.setup('api-docs', app, document)
```

Controllers/DTOs use `@nestjs/swagger` decorators (`@ApiOperation`, `@ApiResponse`, `@ApiProperty`) to describe endpoints. Zod schemas from `@monorepo-template/contracts` can be used directly in DTOs decorated with `@ApiProperty` via `zod-openapi`.

---

### 2. Rate Limiting

**Library:** `@nestjs/throttler`

**Default config:** 60 requests per 60 seconds per IP (in-memory store, no Redis dep).

**Env vars added to `apps/api/src/env.ts`:**

```ts
THROTTLE_TTL: z.coerce.number().default(60000),   // milliseconds
THROTTLE_LIMIT: z.coerce.number().default(60),
```

**Wiring in `apps/api/src/app.module.ts`:**

```ts
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'

ThrottlerModule.forRoot([{
  ttl: env.THROTTLE_TTL,
  limit: env.THROTTLE_LIMIT,
}])
// + { provide: APP_GUARD, useClass: ThrottlerGuard } in providers
```

Throttle limit is applied globally. Individual routes can override with `@Throttle()` or bypass with `@SkipThrottle()`.

---

### 3. Global Exception Filter

**File:** `apps/api/src/filters/all-exceptions.filter.ts`

**Behavior:**
- `HttpException` → use its status code and message
- Everything else → `500 Internal Server Error`, logs full error via injected Pino logger
- Response shape:
  ```json
  { "statusCode": 400, "error": "Bad Request", "message": "Validation failed" }
  ```

**Registration in `apps/api/src/main.ts`:**
```ts
app.useGlobalFilters(new AllExceptionsFilter(app.get(Logger)))
```

Uses `Logger` from `nestjs-pino` (already available via `ObservabilityModule`).

---

## Files Modified/Created

```
apps/api/src/main.ts                         ← swagger setup + filter registration
apps/api/src/env.ts                          ← THROTTLE_TTL, THROTTLE_LIMIT
apps/api/src/app.module.ts                   ← ThrottlerModule import
apps/api/src/filters/
  all-exceptions.filter.ts                   ← new
apps/api/.env.example                        ← throttle env var comments
```

---

## Testing

- Unit test: `AllExceptionsFilter` returns correct shape for `HttpException` and unknown errors.
- e2e test: `GET /api` after rate limit exhausted returns `429`.
- e2e test: `GET /api-docs` returns `200`.
