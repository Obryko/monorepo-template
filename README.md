# monorepo-template

A pnpm monorepo template with a NestJS API, TanStack Start web app, and shared packages for contracts, env, linting, and TypeScript config.

## Stack

| Layer | Tech |
|---|---|
| API | NestJS 11 + Fastify |
| Web | TanStack Start, React 19, Vite 8, TailwindCSS 4 |
| Shared contracts | Zod |
| Env validation | @t3-oss/env-core + Zod |
| Lint/Format | Biome |
| Tests | Rstest (all packages + apps/web + apps/api), Vitest (packages/ui), Playwright (web e2e), Supertest (api e2e) |
| Package manager | pnpm 11 workspaces |
| Node | 24 |

## Structure

```text
apps/
  api/        NestJS API (Fastify, ESM)
  web/        TanStack Start SPA
packages/
  contracts/          Shared Zod schemas (published as dist)
  env/                Shared env primitives (createEnv, nodeEnvSchema, portSchema)
  linter/             Shared Biome base config
  typescript-config/  Shared tsconfig presets
```

## Getting started

```bash
pnpm install
pnpm dev:api   # API on :3001
pnpm dev:web   # Web on :3000
```

Copy `.env.example` to `.env` in `apps/api/` and `apps/web/` before running.

## Common commands

```bash
pnpm check           # lint + format check
pnpm check:fix       # auto-fix
pnpm typecheck       # typecheck all workspaces
pnpm test            # unit tests
pnpm test:e2e:web    # Playwright e2e
pnpm build           # build all
```

## Using as a template

See [CLAUDE.md](./CLAUDE.md#using-this-as-a-template) for the full rename checklist.

Short version — replace `@monorepo-template` with your scope in all files, then `pnpm install`:

```bash
find . -not -path "*/node_modules/*" -not -path "*/.git/*" \
  \( -name "*.json" -o -name "*.ts" -o -name "*.tsx" -o -name "*.yml" -o -name "*.md" \) \
  -exec perl -i -pe 's{\@monorepo-template/}{\@your-scope/}g' {} +
# Update root package.json "name" and "repository.url" manually, then:
pnpm install
```
