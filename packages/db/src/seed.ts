import { createDb } from './client.ts'
import { users } from './schema/index.ts'

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) throw new Error('DATABASE_URL is required')

const db = createDb(DATABASE_URL)

try {
  await db
    .insert(users)
    .values([
      { email: 'alice@example.com', name: 'Alice' },
      { email: 'bob@example.com', name: 'Bob' },
      { email: 'charlie@example.com', name: 'Charlie' },
    ])
    .onConflictDoNothing({ target: users.email })

  console.log('Seeded 3 users.')
} finally {
  await db.$client.end()
}
