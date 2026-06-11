import { createDb, type Db } from '@monorepo-template/db'
import { Global, Inject, Module, type OnApplicationShutdown } from '@nestjs/common'
import { env } from '../env.ts'

export const DB_TOKEN = Symbol('DB')

@Global()
@Module({
  providers: [
    {
      provide: DB_TOKEN,
      useFactory: () => createDb(env.DATABASE_URL),
    },
  ],
  exports: [DB_TOKEN],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(@Inject(DB_TOKEN) private readonly db: Db) {}

  async onApplicationShutdown(): Promise<void> {
    await this.db.$client.end()
  }
}
