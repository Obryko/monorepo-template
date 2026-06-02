FROM node:24-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN corepack enable

WORKDIR /repo


FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/env/package.json packages/env/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json
COPY packages/linter/package.json packages/linter/package.json

RUN pnpm install --frozen-lockfile


FROM deps AS builder

COPY . .

RUN pnpm --filter @monorepo-template/api... build
RUN pnpm --filter @monorepo-template/api --prod deploy /prod/api


FROM node:24-bookworm-slim AS runner

ENV NODE_ENV=production
ENV PORT=3001

WORKDIR /app

COPY --from=builder /prod/api ./

EXPOSE 3001

CMD ["node", "dist/main.js"]
