/**
 * React / browser Sentry integration.
 *
 * Usage in apps/web/src/routes/__root.tsx (or entry file):
 *   import { initClientSentry } from '@monorepo-template/sentry/client'
 *   initClientSentry({ dsn: clientEnv.PUBLIC_SENTRY_DSN ?? '' })
 *
 * Add to apps/web/src/env/client.ts:
 *   PUBLIC_SENTRY_DSN: z.url().optional(),
 */
import * as Sentry from '@sentry/react'

export { ErrorBoundary } from '@sentry/react'

export interface ClientSentryOptions {
  dsn: string
  environment?: string
  release?: string
  tracesSampleRate?: number
}

export function initClientSentry(options: ClientSentryOptions): void {
  if (!options.dsn) return
  Sentry.init({
    dsn: options.dsn,
    ...(options.environment !== undefined ? { environment: options.environment } : {}),
    ...(options.release !== undefined ? { release: options.release } : {}),
    tracesSampleRate: options.tracesSampleRate ?? 0.1,
    integrations: [Sentry.browserTracingIntegration()],
  })
}
