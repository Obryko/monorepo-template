import { Controller, Get, Inject } from '@nestjs/common'
import { HealthCheck, type HealthCheckService, type MemoryHealthIndicator } from '@nestjs/terminus'
import type { HealthModuleOptions } from './health.module.ts'

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    @Inject('HEALTH_MODULE_OPTIONS') private readonly options: HealthModuleOptions,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const heapThreshold = this.options.memoryHeapThreshold ?? 314_572_800
    const rssThreshold = this.options.memoryRssThreshold ?? 314_572_800
    const defaultChecks = [
      () => this.memory.checkHeap('memory_heap', heapThreshold),
      () => this.memory.checkRSS('memory_rss', rssThreshold),
    ]
    const extraChecks = this.options.indicators ?? []
    return this.health.check([...defaultChecks, ...extraChecks])
  }
}
