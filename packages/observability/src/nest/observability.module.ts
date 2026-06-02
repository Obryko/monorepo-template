import {
  type DynamicModule,
  Global,
  type MiddlewareConsumer,
  Module,
  type NestModule,
} from '@nestjs/common'
import { LoggerModule } from 'nestjs-pino'
import { createMetricsRegistry } from '../metrics.ts'
import { CorrelationMiddleware, correlationStorage } from './correlation.middleware.ts'
import { METRICS_REGISTRY, MetricsController } from './metrics.controller.ts'

export interface ObservabilityModuleOptions {
  serviceName: string
  logLevel?: string
}

@Global()
@Module({})
export class ObservabilityModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationMiddleware).forRoutes('*')
  }

  static forRoot(options: ObservabilityModuleOptions): DynamicModule {
    const logLevel = options.logLevel ?? process.env['LOG_LEVEL'] ?? 'info'
    const registry = createMetricsRegistry()

    return {
      module: ObservabilityModule,
      imports: [
        LoggerModule.forRoot({
          pinoHttp: {
            level: logLevel,
            autoLogging: true,
            customProps: () => ({
              correlationId: correlationStorage.getStore(),
            }),
            serializers: {
              req: (req: { method: string; url: string }) => ({
                method: req.method,
                url: req.url,
              }),
              res: (res: { statusCode: number }) => ({
                statusCode: res.statusCode,
              }),
            },
          },
        }),
      ],
      controllers: [MetricsController],
      providers: [{ provide: METRICS_REGISTRY, useValue: registry }],
      exports: [METRICS_REGISTRY],
    }
  }
}
