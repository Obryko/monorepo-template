import { randomBytes } from 'node:crypto'

const TRACEPARENT_RE = /^00-[0-9a-f]{32}-[0-9a-f]{16}-[0-9a-f]{2}$/

export function generateCorrelationId(): string {
  const traceId = randomBytes(16).toString('hex')
  const spanId = randomBytes(8).toString('hex')
  return `00-${traceId}-${spanId}-01`
}

export function extractCorrelationId(
  headers: Record<string, string | string[] | undefined>,
): string {
  const traceparent = headers['traceparent']
  if (typeof traceparent === 'string' && TRACEPARENT_RE.test(traceparent)) {
    return traceparent
  }
  const xRequestId = headers['x-request-id']
  if (typeof xRequestId === 'string' && xRequestId.length > 0) {
    return xRequestId
  }
  return generateCorrelationId()
}

export function injectCorrelationHeaders(
  headers: Record<string, string>,
  correlationId: string,
): Record<string, string> {
  headers['traceparent'] = correlationId
  headers['x-request-id'] = correlationId
  return headers
}
