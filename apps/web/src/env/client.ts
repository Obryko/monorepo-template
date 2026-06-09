import { createEnv, z } from '@monorepo-template/env'

export const clientEnv = createEnv({
  clientPrefix: 'PUBLIC_',
  client: {
    PUBLIC_APP_NAME: z.string().default('monorepo-template'),
    PUBLIC_API_URL: z.url().default('http://localhost:3001/api'),
    PUBLIC_SENTRY_DSN: z.url().optional(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})
