# Monorepo Template Copilot Instructions

This is a pnpm monorepo template with a NestJS API and a TanStack Start web app.

## Repository structure

- `apps/api` — NestJS API using Fastify.
- `apps/web` — TanStack Start web application.
- `packages/contracts` — shared API contracts based on Zod.
- `packages/env` — shared environment primitives and Node env helpers.
- `packages/linter` — shared Biome configuration.
- `packages/typescript-config` — shared TypeScript configurations.

Use package scope `@monorepo-template/*`.

## Package manager

Use pnpm workspaces only.

Do not introduce npm, yarn, Nx, Turborepo, Lerna, or other monorepo tools unless explicitly requested.

Prefer:

```bash
pnpm --filter <package-name> <script>
pnpm -r --if-present <script>
```

## Code style

Use Biome for formatting, linting, and import organization.

Do not add:

- ESLint
- Prettier
- eslint-config-*
- prettier plugins

Use:

```bash
pnpm check
pnpm check:fix
```

## TypeScript

Use strict TypeScript.

Prefer explicit, readable types for public exports in packages.

Do not add `any` unless there is a strong reason and the reason is documented.

For tests, import test APIs explicitly — never rely on globals.

The project uses one test runner everywhere:

- `@rstest/core` — all packages, `apps/web`, and `apps/api`

```ts
import { describe, expect, it } from '@rstest/core'
```

## Imports and NestJS

The API currently uses ESM-oriented TypeScript configuration.

Use local `.ts` imports where required by the current tsconfig setup:

```ts
import { AppModule } from './app.module.ts'
```

Do not convert NestJS dependency-injection imports to `import type` when the class is injected at runtime.

Bad:

```ts
import type { AppService } from './app.service.ts'
```

Good:

```ts
import { AppService } from './app.service.ts'
```

## Environment variables

Use `@monorepo-template/env` for shared env primitives only.

Do not put app-specific env schemas into `packages/env`.

App-specific env schemas belong near the app:

- `apps/api/src/env.ts`
- `apps/web/src/env/client.ts`
- `apps/web/src/env/server.ts`
- `apps/web/playwright.env.ts`

Do not use `dotenv`. The project targets Node 24 and uses native Node env-file support where needed.

`packages/env` must not contain Playwright-specific variables.

## Biome nested configs

Nested Biome configs must use:

```json
{
  "root": false,
  "extends": "//"
}
```

## Testing

Use:

- Rstest (`@rstest/core`) for unit/component tests in all packages, `apps/web`, and `apps/api`.
- Playwright for web e2e tests.
- Supertest + Rstest for API e2e tests.

## Build and deployment

The project is intended to be deployable with Docker.

For workspace dependencies, prefer commands with dependency closure:

```bash
pnpm --filter @monorepo-template/api... build
pnpm --filter @monorepo-template/web... build
```

Do not add Dockerfiles casually without checking the real app build output first.

## General behavior

Keep changes small, explicit, and consistent with the existing monorepo setup.

Avoid adding new libraries when the current stack already solves the problem.
