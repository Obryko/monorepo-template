import { afterEach, describe, expect, it, vi } from 'vitest'
import { createTracedFetch } from '../fetch.ts'

describe('createTracedFetch', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('injects traceparent and x-request-id on every request', async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response('ok'))
    vi.stubGlobal('fetch', mockFetch)

    const tracedFetch = createTracedFetch(() => 'test-corr-id')
    await tracedFetch('https://example.com')

    const [, init] = mockFetch.mock.calls[0] as [unknown, RequestInit]
    const headers = init.headers as Record<string, string>
    expect(headers['traceparent']).toBe('test-corr-id')
    expect(headers['x-request-id']).toBe('test-corr-id')
  })

  it('preserves existing request headers', async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response('ok'))
    vi.stubGlobal('fetch', mockFetch)

    const tracedFetch = createTracedFetch(() => 'corr-id')
    await tracedFetch('https://example.com', {
      headers: { Authorization: 'Bearer token' },
    })

    const [, init] = mockFetch.mock.calls[0] as [unknown, RequestInit]
    const headers = init.headers as Record<string, string>
    expect(headers['Authorization']).toBe('Bearer token')
    expect(headers['traceparent']).toBe('corr-id')
  })

  it('calls getCorrelationId on each request', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('ok')))
    const getCorrelationId = vi.fn().mockReturnValue('dynamic-id')

    const tracedFetch = createTracedFetch(getCorrelationId)
    await tracedFetch('https://example.com')
    await tracedFetch('https://example.com')

    expect(getCorrelationId).toHaveBeenCalledTimes(2)
  })
})
