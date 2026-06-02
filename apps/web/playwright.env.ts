import { createEnv, portSchema, z } from '@monorepo-template/env'
import { loadExistingEnvFiles } from '@monorepo-template/env/node'

loadExistingEnvFiles([
  'apps/web/.env.e2e.local',
  'apps/web/.env.e2e',
  'apps/web/.env.local',
  'apps/web/.env',
])

export const playwrightEnv = createEnv({
  server: {
    E2E_BASE_URL: z.url().optional(),
    E2E_WEB_PORT: portSchema.default(3000),
    CI: z.string().optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
