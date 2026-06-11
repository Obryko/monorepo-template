import type { User } from '@monorepo-template/contracts'
import { type Db, schema } from '@monorepo-template/db'
import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { DB_TOKEN } from '../database/database.module.ts'

@Injectable()
export class UsersService {
  constructor(@Inject(DB_TOKEN) private readonly db: Db) {}

  async findAll(): Promise<User[]> {
    const rows = await this.db.select().from(schema.users)
    return rows.map(toUser)
  }

  async findOne(id: string): Promise<User | null> {
    const rows = await this.db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1)
    return rows[0] ? toUser(rows[0]) : null
  }
}

function toUser(row: typeof schema.users.$inferSelect): User {
  return {
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}
