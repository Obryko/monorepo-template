import { injectCorrelationHeaders } from './correlation.ts'

export function createTracedFetch(getCorrelationId: () => string): typeof fetch {
  return (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
    const headers: Record<string, string> = {}

    const existing = init?.headers
    if (existing instanceof Headers) {
      existing.forEach((value, key) => {
        headers[key] = value
      })
    } else if (existing) {
      Object.assign(headers, existing)
    }

    injectCorrelationHeaders(headers, getCorrelationId())

    return fetch(input, { ...init, headers })
  }
}
