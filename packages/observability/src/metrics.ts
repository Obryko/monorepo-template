import { collectDefaultMetrics, Registry } from 'prom-client'

export function createMetricsRegistry(): Registry {
  const registry = new Registry()
  collectDefaultMetrics({ register: registry })
  return registry
}
