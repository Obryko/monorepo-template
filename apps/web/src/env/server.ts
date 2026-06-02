import { createEnv, nodeEnvSchema, z } from '@monorepo-template/env'
import { loadExistingEnvFiles } from '@monorepo-template/env/node'

if (process.env.NODE_ENV !== 'production') {
  loadExistingEnvFiles(['apps/web/.env.local', 'apps/web/.env'])
}

export function getServerEnv() {
  return createEnv({
    server: {
      NODE_ENV: nodeEnvSchema,
      API_INTERNAL_URL: z.url().default('http://localhost:3001/api'),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
  })
}
