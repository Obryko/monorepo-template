import { describe, expect, it } from '@rstest/core'
import { databaseUrlSchema } from '../index.ts'

describe('databaseUrlSchema', () => {
  it('accepts a valid postgres URL', () => {
    expect(() => databaseUrlSchema.parse('postgres://user:pass@localhost:5432/db')).not.toThrow()
  })

  it('rejects a non-URL string', () => {
    expect(() => databaseUrlSchema.parse('not-a-url')).toThrow()
  })
})
