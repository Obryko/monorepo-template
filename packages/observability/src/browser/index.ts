import pino from 'pino'

export function createBrowserLogger(options: { name: string; level?: string }): pino.Logger {
  return pino({
    name: options.name,
    level: options.level ?? 'info',
    browser: { asObject: true },
  })
}

export {
  extractCorrelationId,
  generateCorrelationId,
  injectCorrelationHeaders,
} from '../correlation.ts'
export { createTracedFetch } from '../fetch.ts'
