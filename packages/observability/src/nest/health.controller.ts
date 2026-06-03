import { Controller, Get, Inject } from '@nestjs/common'
import {
  HealthCheck,
  HealthCheckService,
  type HealthIndicatorFunction,
  MemoryHealthIndicator,
} from '@nestjs/terminus'
import type { HealthModuleOptions } from './health.module.ts'

@Controller('health')
export class HealthController {
  constructor(
    @Inject(HealthCheckService) private readonly health: HealthCheckService,
    @Inject(MemoryHealthIndicator) private readonly memory: MemoryHealthIndicator,
    @Inject('HEALTH_MODULE_OPTIONS') private readonly options: HealthModuleOptions,
  ) {}

  @Get()
  @HealthCheck()
  check(): Promise<unknown> {
    const heapThreshold = this.options.memoryHeapThreshold ?? 314_572_800
    const rssThreshold = this.options.memoryRssThreshold ?? 314_572_800
    const defaultChecks: HealthIndicatorFunction[] = [
      () => this.memory.checkHeap('memory_heap', heapThreshold),
      () => this.memory.checkRSS('memory_rss', rssThreshold),
    ]
    const extraChecks = this.options.indicators ?? []
    return this.health.check([...defaultChecks, ...extraChecks])
  }
}
