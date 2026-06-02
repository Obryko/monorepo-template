import { createEnv, z } from '@monorepo-template/env'

export const clientEnv = createEnv({
  clientPrefix: 'VITE_',
  client: {
    VITE_APP_NAME: z.string().default('monorepo-template'),
    VITE_API_URL: z.url().default('http://localhost:3001/api'),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})
