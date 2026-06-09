import { describe, expect, it } from '@rstest/core'
import { users } from '../schema/index.ts'

describe('users schema', () => {
  it('exports users table', () => {
    expect(users).toBeDefined()
    const nameSym = Object.getOwnPropertySymbols(users).find(
      (s) => s.description === 'drizzle:Name',
    )
    expect(users[nameSym!]).toBe('users')
  })

  it('has expected columns', () => {
    const colSym = Object.getOwnPropertySymbols(users).find(
      (s) => s.description === 'drizzle:Columns',
    )
    const cols = Object.keys(users[colSym!])
    expect(cols).toContain('id')
    expect(cols).toContain('email')
    expect(cols).toContain('name')
    expect(cols).toContain('createdAt')
  })
})
