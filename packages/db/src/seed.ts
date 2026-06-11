import { createDb } from './client.ts'
import { users } from './schema/index.ts'

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) throw new Error('DATABASE_URL is required')

const db = createDb(DATABASE_URL)

try {
  const inserted = await db
    .insert(users)
    .values([
      { email: 'alice@example.com', name: 'Alice' },
      { email: 'bob@example.com', name: 'Bob' },
      { email: 'charlie@example.com', name: 'Charlie' },
    ])
    .onConflictDoNothing({ target: users.email })
    .returning({ id: users.id })

  console.log(
    inserted.length === 0
      ? 'Seed: 0 users inserted (all already present).'
      : `Seed: ${inserted.length} user(s) inserted.`,
  )
} finally {
  await db.$client.end()
}
