# monorepo-template

A pnpm monorepo template with a NestJS API, TanStack Start web app, Module Federation remote app, and shared packages.

## Stack

| Layer | Tech |
|---|---|
| API | NestJS 11 + Fastify |
| Web | TanStack Start, React 19, Rsbuild, TailwindCSS 4 |
| Remote MF | Rsbuild + Module Federation (exposes components to shell) |
| Shared contracts | Zod + zod-openapi |
| Env validation | @t3-oss/env-core + Zod |
| Lint/Format | Biome |
| Tests | Rstest (unit), Playwright (web e2e), Supertest (api e2e) |
| Package manager | pnpm 11 workspaces |
| Node | 24 |

## Structure

```text
apps/
  api/        NestJS API (Fastify, ESM) — http://localhost:3001
  web/        TanStack Start shell (Rsbuild, MF host) — http://localhost:3000
  remote/     Module Federation remote app — http://localhost:3002
packages/
  contracts/          Shared Zod schemas with OpenAPI metadata
  db/                 Drizzle ORM client + schema
  env/                Shared env primitives (createEnv, nodeEnvSchema, portSchema)
  linter/             Shared Biome base config
  observability/      OpenTelemetry, correlation IDs, health checks
  typescript-config/  Shared tsconfig presets
  ui/                 React component library (shadcn/ui)
```

## Getting started

```bash
pnpm install

# Copy env examples
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Start all services (API + remote + web)
pnpm dev
```

Services:
- **API** — `http://localhost:3001` · Swagger at `http://localhost:3001/api-docs`
- **Web** — `http://localhost:3000`
- **Remote** — `http://localhost:3002` (required for MF component in shell)

## Module Federation

`apps/remote` exposes components that `apps/web` (the shell) loads at runtime. The shell MF config in `apps/web/rsbuild.config.ts` reads `REMOTE_URL` from `.env` (default: `http://localhost:3002`).

To run only specific services:
```bash
pnpm dev:api      # API on :3001
pnpm dev:remote   # MF remote on :3002
pnpm dev:web      # Web shell on :3000
```

## Common commands

```bash
pnpm check           # lint + format check
pnpm check:fix       # auto-fix
pnpm typecheck       # typecheck all workspaces
pnpm test            # unit tests
pnpm test:e2e:web    # Playwright e2e
pnpm build           # build all

# Database
pnpm db:generate     # generate Drizzle migration from schema changes
pnpm db:migrate      # run pending migrations
pnpm db:studio       # open Drizzle Studio
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
