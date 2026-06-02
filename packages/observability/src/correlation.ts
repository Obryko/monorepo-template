const TRACEPARENT_RE = /^00-[0-9a-f]{32}-[0-9a-f]{16}-[0-9a-f]{2}$/

function randomHex(bytes: number): string {
  const buf = new Uint8Array(bytes)
  globalThis.crypto.getRandomValues(buf)
  return Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('')
}

export function generateCorrelationId(): string {
  return `00-${randomHex(16)}-${randomHex(8)}-01`
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
