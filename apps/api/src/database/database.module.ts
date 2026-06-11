import { createDb } from '@monorepo-template/db'
import { Global, Module } from '@nestjs/common'
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
export class DatabaseModule {}
