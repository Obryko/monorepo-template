# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

- **API**: NestJS 11 + Fastify, ESM, Node 24
- **Web**: TanStack Start (React 19, Vite 8, TailwindCSS 4)
- **Contracts**: Zod schemas shared between API and web (built via `tsdown`)
- **Env**: `@t3-oss/env-core` + Zod schemas, split into `index` (browser-safe) and `node` entrypoints
- **Tooling**: pnpm workspaces, Biome (lint + format), Rstest (node packages + apps/web) + Vitest (packages/ui + apps/api), Playwright, Husky + lint-staged

## Commands

```bash
# Install
pnpm install

# Dev
pnpm dev:api        # NestJS watch mode
pnpm dev:web        # Vite dev server on :3000

# Build
pnpm build:internal # Build contracts + env (required before typecheck/test)
pnpm build          # Build all packages/apps
pnpm build:api      # Build api with dependency closure
pnpm build:web      # Build web with dependency closure

# Check (lint + format)
pnpm check
pnpm check:fix

# Typecheck
pnpm typecheck      # builds internal first, then checks all workspaces

# Tests
pnpm test                             # unit tests across all workspaces
pnpm --filter @monorepo-template/api test:unit:watch  # watch mode, api
pnpm --filter @monorepo-template/web test:watch       # watch mode, web
pnpm test:e2e                         # all e2e tests
pnpm test:e2e:web                     # Playwright only
pnpm --filter @monorepo-template/web test:e2e:ui      # Playwright UI mode

# Affected-only (compares to HEAD)
pnpm affected:check
pnpm affected:typecheck
pnpm affected:test
```

## Architecture

### Internal package dependency

`apps/api` and `apps/web` both depend on:
- `@monorepo-template/contracts` — Zod schemas for shared types/validation
- `@monorepo-template/env` — base env utilities (`createEnv`, `nodeEnvSchema`, `portSchema`, `z`)

**Always run `pnpm build:internal` before typecheck or tests** — the apps import compiled dist files.

### Env schema pattern

App-specific env schemas live in the app, not in `packages/env`:
- `apps/api/src/env.ts` — server env (NestJS)
- `apps/web/src/env/client.ts` — VITE_* client vars
- `apps/web/src/env/server.ts` — server-side vars in SSR
- `apps/web/playwright.env.ts` — e2e test env

`packages/env` exports only reusable primitives. Never import Playwright types there.

### Biome config inheritance

Root `biome.json` extends `@monorepo-template/linter/biome`. All nested configs must use `"root": false` + `"extends": "//"`.

### NestJS ESM imports

The API uses ESM. Import `.ts` extensions explicitly:

```ts
import { AppModule } from './app.module.ts'
```

Do not use `import type` for NestJS DI-injected classes — the runtime needs the value import.

### Testing split (API)

- `vitest.unit.config.ts` — unit tests (`src/**/*.spec.ts`)
- `vitest.e2e.config.ts` — e2e tests (`test/**/*.spec.ts`), uses Supertest

### Web routing

TanStack Start with file-based routing. `src/routeTree.gen.ts` is auto-generated — do not edit manually.

### pnpm catalog

Shared dependency versions (biome, typescript, vitest, tsdown, zod, @types/node) are pinned in `pnpm-workspace.yaml` under `catalog:`. Reference them as `"catalog:"` in package.json.

## Git hooks
- **pre-commit**: lint-staged (Biome check + write) → typecheck
- **pre-push**: full test suite

## Using this as a template

When initializing a new project from this template, rename these locations:

1. **Root `package.json`**: `name` field and `repository.url`
2. **All `package.json` files** under `apps/` and `packages/`: the `name` field (`@monorepo-template/...` → `@your-scope/...`)
3. **Cross-references**: `dependencies`/`devDependencies` entries using `workspace:*` with the old scope
4. **Scripts** in root `package.json`: all `--filter @monorepo-template/...` arguments
5. **`tsconfig.json` files**: `extends` fields referencing `@monorepo-template/typescript-config`
6. **`biome.json`**: root extends `@monorepo-template/linter/biome`
7. **Source imports**: any `from '@monorepo-template/...'` in `.ts`/`.tsx` files
8. **`pnpm-lock.yaml`**: run `pnpm install` after all renames to regenerate
9. **`.github/copilot-instructions.md`**: update scope and project description
10. **`.github/workflows/ci.yml`**: `--filter @monorepo-template/web` reference
11. **`sonar-project.properties`**: replace `YOUR_GITHUB_ORG` placeholders in `sonar.projectKey` and `sonar.organization` before enabling the `SONAR_ENABLED` repo variable
12. **App name** (find + replace your project name):
    - `apps/web/src/env/client.ts` — `VITE_APP_NAME` default value
    - `apps/web/.env.example` — `VITE_APP_NAME` value
    - `apps/web/public/manifest.json` — `short_name` and `name` fields
    - `apps/web/Dockerfile` — `ARG VITE_APP_NAME` default
    - `docker-compose.yml` — `VITE_APP_NAME` build arg

Quick rename (replace `your-scope` and `your-app-name`):
```bash
# Rename package scope (perl -i works identically on macOS and Linux)
find . -not -path "*/node_modules/*" -not -path "*/.git/*" \
  \( -name "*.json" -o -name "*.ts" -o -name "*.tsx" -o -name "*.yml" -o -name "*.md" \) \
  -exec perl -i -pe 's{\@monorepo-template/}{\@your-scope/}g' {} +

# Rename app display name
find . -not -path "*/node_modules/*" -not -path "*/.git/*" \
  \( -name "*.json" -o -name "*.ts" -o -name "*.yml" \) \
  -exec perl -i -pe 's{monorepo-template}{your-app-name}g' {} +

pnpm install
```
