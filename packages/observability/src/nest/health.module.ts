import { type DynamicModule, Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { HealthController } from './health.controller.ts'

export interface HealthModuleOptions {
  indicators?: (() => Promise<unknown>)[]
  memoryHeapThreshold?: number
  memoryRssThreshold?: number
}

@Module({})
export class HealthModule {
  static forRoot(options: HealthModuleOptions = {}): DynamicModule {
    return {
      module: HealthModule,
      imports: [TerminusModule],
      controllers: [HealthController],
      providers: [
        {
          provide: 'HEALTH_MODULE_OPTIONS',
          useValue: options,
        },
      ],
    }
  }
}
