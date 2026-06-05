import { describe, expect, it } from '@rstest/core'

describe('env throttle vars', () => {
  it('THROTTLE_TTL defaults to 60000', async () => {
    const { env } = await import('./env.ts')
    expect(env.THROTTLE_TTL).toBe(60000)
  })

  it('THROTTLE_LIMIT defaults to 60', async () => {
    const { env } = await import('./env.ts')
    expect(env.THROTTLE_LIMIT).toBe(60)
  })
})
