import { z } from 'zod'

export { createEnv } from '@t3-oss/env-core'

export const nodeEnvSchema = z.enum(['development', 'test', 'production']).default('development')

export const portSchema = z.coerce.number().int().min(1).max(65_535)

export const otelEndpointSchema = z.string().url().optional()
export const otelServiceVersionSchema = z.string().optional()

export { z } from 'zod'
