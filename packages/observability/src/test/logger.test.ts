import { describe, expect, it } from 'vitest'
import { createLogger } from '../logger.ts'

describe('createLogger', () => {
  it('uses info level by default', () => {
    const logger = createLogger({ name: 'test' })
    expect(logger.level).toBe('info')
  })

  it('uses provided level option', () => {
    const logger = createLogger({ name: 'test', level: 'debug' })
    expect(logger.level).toBe('debug')
  })

  it('returns a pino logger with child method', () => {
    const logger = createLogger({ name: 'test' })
    expect(typeof logger.child).toBe('function')
    expect(typeof logger.info).toBe('function')
    expect(typeof logger.error).toBe('function')
  })
})
