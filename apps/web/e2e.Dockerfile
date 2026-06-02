FROM mcr.microsoft.com/playwright:v1.60.0-noble

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ENV CI=true

RUN corepack enable

WORKDIR /repo

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/env/package.json packages/env/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json
COPY packages/linter/package.json packages/linter/package.json

RUN pnpm install --frozen-lockfile

COPY . .

CMD ["pnpm", "--filter", "@lingua-forge/web", "test:e2e"]
