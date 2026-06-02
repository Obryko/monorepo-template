FROM node:24-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN corepack enable

WORKDIR /repo


FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/env/package.json packages/env/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json
COPY packages/linter/package.json packages/linter/package.json

RUN pnpm install --frozen-lockfile


FROM deps AS builder

COPY . .

ARG VITE_APP_NAME=monorepo-template
ARG VITE_API_URL=http://localhost:3001/api

ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_API_URL=$VITE_API_URL

RUN pnpm --filter @monorepo-template/web... build
RUN pnpm --filter @monorepo-template/web --prod deploy /prod/web


FROM node:24-bookworm-slim AS runner

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

WORKDIR /app

COPY --from=builder /prod/web ./

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
