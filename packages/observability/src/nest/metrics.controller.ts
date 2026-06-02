import { Controller, Get, Inject, Res } from '@nestjs/common'
import type { FastifyReply } from 'fastify'
import type { Registry } from 'prom-client'

export const METRICS_REGISTRY = 'METRICS_REGISTRY' as const

@Controller('metrics')
export class MetricsController {
  constructor(@Inject(METRICS_REGISTRY) private readonly registry: Registry) {}

  @Get()
  async getMetrics(@Res() res: FastifyReply): Promise<void> {
    const metrics = await this.registry.metrics()
    void res.header('Content-Type', this.registry.contentType).send(metrics)
  }
}
