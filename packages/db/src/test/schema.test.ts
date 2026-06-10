import { describe, expect, it } from '@rstest/core'
import { getTableColumns, getTableName } from 'drizzle-orm'
import { users } from '../schema/index.ts'

describe('users schema', () => {
  it('exports users table named "users"', () => {
    expect(getTableName(users)).toBe('users')
  })

  it('has expected columns', () => {
    const cols = Object.keys(getTableColumns(users))
    expect(cols).toEqual(['id', 'email', 'name', 'createdAt', 'updatedAt'])
  })

  it('email column is unique', () => {
    expect(getTableColumns(users).email.isUnique).toBe(true)
  })
})
