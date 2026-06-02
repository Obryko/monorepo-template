import { type PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js'
import postgres, { type Sql } from 'postgres'
import * as schema from './schema/index.ts'

type Schema = typeof schema

export function createDb(url: string): PostgresJsDatabase<Schema> & { $client: Sql } {
  const client = postgres(url)
  return drizzle(client, { schema })
}

export type Db = ReturnType<typeof createDb>
