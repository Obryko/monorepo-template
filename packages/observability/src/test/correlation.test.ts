import { describe, expect, it } from '@rstest/core'
import {
  extractCorrelationId,
  generateCorrelationId,
  injectCorrelationHeaders,
} from '../correlation.ts'

describe('generateCorrelationId', () => {
  it('returns W3C traceparent format', () => {
    expect(generateCorrelationId()).toMatch(/^00-[0-9a-f]{32}-[0-9a-f]{16}-01$/)
  })

  it('returns unique IDs on each call', () => {
    expect(generateCorrelationId()).not.toBe(generateCorrelationId())
  })
})

describe('extractCorrelationId', () => {
  it('extracts valid traceparent header', () => {
    const tp = '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01'
    expect(extractCorrelationId({ traceparent: tp })).toBe(tp)
  })

  it('falls back to x-request-id when traceparent absent', () => {
    expect(extractCorrelationId({ 'x-request-id': 'my-id' })).toBe('my-id')
  })

  it('falls back to x-request-id when traceparent invalid', () => {
    expect(extractCorrelationId({ traceparent: 'bad', 'x-request-id': 'my-id' })).toBe('my-id')
  })

  it('generates new ID when no headers present', () => {
    expect(extractCorrelationId({})).toMatch(/^00-[0-9a-f]{32}-[0-9a-f]{16}-01$/)
  })
})

describe('injectCorrelationHeaders', () => {
  it('sets traceparent and x-request-id', () => {
    const headers: Record<string, string> = {}
    injectCorrelationHeaders(headers, 'corr-id')
    expect(headers['traceparent']).toBe('corr-id')
    expect(headers['x-request-id']).toBe('corr-id')
  })

  it('returns the same headers object', () => {
    const headers: Record<string, string> = {}
    expect(injectCorrelationHeaders(headers, 'id')).toBe(headers)
  })
})
