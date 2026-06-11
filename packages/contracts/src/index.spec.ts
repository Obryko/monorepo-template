import { describe, expect, it } from '@rstest/core'
import { UserListSchema, UserSchema } from './index.ts'

describe('UserSchema', () => {
  const validUser = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'alice@example.com',
    name: 'Alice',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  }

  it('parses a valid user', () => {
    expect(UserSchema.parse(validUser)).toEqual(validUser)
  })

  it('rejects invalid email', () => {
    expect(() => UserSchema.parse({ ...validUser, email: 'not-an-email' })).toThrow()
  })

  it('rejects non-uuid id', () => {
    expect(() => UserSchema.parse({ ...validUser, id: 'not-a-uuid' })).toThrow()
  })
})

describe('UserListSchema', () => {
  it('parses an array of users', () => {
    const user = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'alice@example.com',
      name: 'Alice',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    }
    expect(UserListSchema.parse([user])).toEqual([user])
  })
})
