/**
 * NestJS Sentry integration.
 *
 * Usage in apps/api/src/main.ts:
 *   import { initSentry } from '@monorepo-template/sentry'
 *   initSentry({ dsn: env.SENTRY_DSN ?? '' })  // call before NestFactory.create
 *
 * Usage in apps/api/src/app.module.ts providers:
 *   { provide: APP_FILTER, useClass: SentryExceptionFilter }
 *
 * Add to apps/api/src/env.ts:
 *   SENTRY_DSN: z.url().optional(),
 */
import * as Sentry from '@sentry/nestjs'

export { SentryExceptionFilter } from './sentry-exception.filter.ts'

export interface SentryOptions {
  dsn: string
  environment?: string
  release?: string
  tracesSampleRate?: number
}

export function initSentry(options: SentryOptions): void {
  if (!options.dsn) return
  const environment = options.environment ?? process.env['NODE_ENV'] ?? 'production'
  Sentry.init({
    dsn: options.dsn,
    environment,
    ...(options.release !== undefined ? { release: options.release } : {}),
    tracesSampleRate: options.tracesSampleRate ?? 0.1,
  })
}
