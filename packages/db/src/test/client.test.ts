import { describe, expect, it } from 'vitest'
import { createDb } from '../client.ts'

describe('createDb', () => {
  it('returns an object with drizzle query methods', () => {
    const db = createDb('postgres://localhost:5432/test')
    expect(typeof db.select).toBe('function')
    expect(typeof db.insert).toBe('function')
    expect(typeof db.update).toBe('function')
    expect(typeof db.delete).toBe('function')
  })
})
