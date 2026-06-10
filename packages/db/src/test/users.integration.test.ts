import { afterAll, afterEach, beforeAll, describe, expect, it } from '@rstest/core'
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { eq } from 'drizzle-orm'
import { createDb, type Db } from '../client.ts'
import { users } from '../schema/index.ts'

describe('users repository (integration)', () => {
  let container: StartedPostgreSqlContainer
  let db: Db

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:17-alpine').start()

    db = createDb(container.getConnectionUri())

    // Push schema — no migration files needed for example tests.
    // pgcrypto provides gen_random_uuid(); core fallback exists from PG 13+,
    // enabling the extension keeps this portable across versions and pgvector-style stacks.
    const client = db.$client
    await client`CREATE EXTENSION IF NOT EXISTS pgcrypto`
    await client`
      CREATE TABLE IF NOT EXISTS users (
        id        uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
        email     text        NOT NULL UNIQUE,
        name      text        NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `
  }, 60_000)

  afterEach(async () => {
    // Each test is self-contained: wipe rows so insertion order doesn't leak between tests.
    await db.delete(users)
  })

  afterAll(async () => {
    await db.$client.end({ timeout: 5 })
    await container.stop()
  })

  it('inserts and retrieves a user', async () => {
    await db.insert(users).values({ email: 'alice@example.com', name: 'Alice' })

    const [found] = await db.select().from(users).where(eq(users.email, 'alice@example.com'))

    expect(found).toBeDefined()
    expect(found.email).toBe('alice@example.com')
    expect(found.name).toBe('Alice')
    expect(found.id).toBeDefined()
    expect(found.createdAt).toBeInstanceOf(Date)
  })

  it('enforces unique email constraint', async () => {
    await db.insert(users).values({ email: 'bob@example.com', name: 'Bob' })

    await expect(
      db.insert(users).values({ email: 'bob@example.com', name: 'Duplicate' }),
    ).rejects.toThrow()
  })

  it('finds user by email', async () => {
    await db.insert(users).values({ email: 'carol@example.com', name: 'Carol' })

    const [found] = await db.select().from(users).where(eq(users.email, 'carol@example.com'))

    expect(found).toBeDefined()
    expect(found.name).toBe('Carol')
  })
})
