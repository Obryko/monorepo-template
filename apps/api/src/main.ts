import { contractSchemas } from '@monorepo-template/contracts'
import { createOtelSdk } from '@monorepo-template/observability'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, type OpenAPIObject, SwaggerModule } from '@nestjs/swagger'
import { createSchema } from 'zod-openapi'
import { AppModule } from './app.module.ts'
import { env } from './env.ts'
import { AllExceptionsFilter } from './filters/all-exceptions.filter.ts'

const sdk = createOtelSdk({
  serviceName: 'api',
  ...(env.OTEL_SERVICE_VERSION ? { version: env.OTEL_SERVICE_VERSION } : {}),
})
sdk.start()

function injectContractSchemas(document: OpenAPIObject): void {
  document.components ??= {}
  document.components.schemas ??= {}

  for (const [name, zodSchema] of Object.entries(contractSchemas)) {
    const { schema, components } = createSchema(zodSchema)
    document.components.schemas[name] = schema as Record<string, unknown>
    if (components?.schemas) {
      Object.assign(document.components.schemas, components.schemas)
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())
  app.setGlobalPrefix('api', { exclude: ['metrics', 'health', 'api-docs'] })
  app.useGlobalFilters(new AllExceptionsFilter(new Logger()))

  const config = new DocumentBuilder().setTitle('API').setVersion('1.0').build()
  const document = SwaggerModule.createDocument(app, config)
  injectContractSchemas(document)
  SwaggerModule.setup('api-docs', app, document)

  await app.listen(env.PORT, '0.0.0.0')
}

await bootstrap()
