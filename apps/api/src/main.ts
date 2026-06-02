import { createOtelSdk } from '@monorepo-template/observability'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module.ts'
import { env } from './env.ts'

const sdk = createOtelSdk({
  serviceName: 'api',
  ...(env.OTEL_SERVICE_VERSION ? { version: env.OTEL_SERVICE_VERSION } : {}),
})
sdk.start()

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())
  app.setGlobalPrefix('api', { exclude: ['metrics', 'health'] })
  await app.listen(env.PORT, '0.0.0.0')
}

await bootstrap()
