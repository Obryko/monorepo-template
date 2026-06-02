import { describe, expect, it } from 'vitest'
import { createMetricsRegistry } from '../metrics.ts'

describe('createMetricsRegistry', () => {
  it('returns a registry with a metrics() method', () => {
    const registry = createMetricsRegistry()
    expect(typeof registry.metrics).toBe('function')
  })

  it('collects default Node.js metrics', async () => {
    const registry = createMetricsRegistry()
    const output = await registry.metrics()
    expect(output).toContain('nodejs_version_info')
  })

  it('two registries are independent', async () => {
    const r1 = createMetricsRegistry()
    const r2 = createMetricsRegistry()
    expect(r1).not.toBe(r2)
  })
})
