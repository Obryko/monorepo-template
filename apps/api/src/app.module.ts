import { HealthModule, ObservabilityModule } from '@monorepo-template/observability/nest'
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { AppController } from './app.controller.ts'
import { AppService } from './app.service.ts'
import { env } from './env.ts'

@Module({
  imports: [
    ObservabilityModule.forRoot({
      serviceName: 'api',
      logLevel: env.LOG_LEVEL,
    }),
    HealthModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: env.THROTTLE_TTL,
        limit: env.THROTTLE_LIMIT,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
