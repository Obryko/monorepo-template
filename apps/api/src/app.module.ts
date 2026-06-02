import { HealthModule, ObservabilityModule } from '@monorepo-template/observability/nest'
import { Module } from '@nestjs/common'
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
