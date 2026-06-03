import { Logger } from '@nestjs/common'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Test, type TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from '@rstest/core'
import { AppModule } from '../src/app.module'
import { AllExceptionsFilter } from '../src/filters/all-exceptions.filter'

describe('App e2e', () => {
  let app: NestFastifyApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter())
    app.setGlobalPrefix('api', { exclude: ['metrics', 'health', 'api-docs'] })
    app.useGlobalFilters(new AllExceptionsFilter(new Logger()))

    const config = new DocumentBuilder().setTitle('API').setVersion('1.0').build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api-docs', app, document)

    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('GET /api returns 200', async () => {
    const response = await request(app.getHttpServer()).get('/api')
    expect(response.status).toBe(200)
    expect(response.text).toBe('Hello World!')
  })

  it('GET /api sets x-request-id response header', async () => {
    const response = await request(app.getHttpServer()).get('/api')
    expect(response.headers['x-request-id']).toBeDefined()
    expect(response.headers['x-request-id']).toMatch(/^00-[0-9a-f]{32}-[0-9a-f]{16}-01$/)
  })

  it('GET /api forwards provided x-request-id', async () => {
    const id = '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01'
    const response = await request(app.getHttpServer()).get('/api').set('x-request-id', id)
    expect(response.headers['x-request-id']).toBe(id)
  })

  it('GET /metrics returns Prometheus metrics', async () => {
    const response = await request(app.getHttpServer()).get('/metrics')
    expect(response.status).toBe(200)
    expect(response.headers['content-type']).toContain('text/plain')
    expect(response.text).toContain('nodejs_version_info')
  })

  it('GET /health returns 200 with status ok', async () => {
    const response = await request(app.getHttpServer()).get('/health')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('ok')
    expect(response.body.info.memory_heap.status).toBe('up')
    expect(response.body.info.memory_rss.status).toBe('up')
  })

  it('GET /api-docs returns 200', async () => {
    const response = await request(app.getHttpServer()).get('/api-docs')
    expect(response.status).toBe(200)
  })

  it('rate limit: throttle headers present on API routes', async () => {
    const response = await request(app.getHttpServer()).get('/api')
    expect(response.status).toBe(200)
    // ThrottlerGuard is active — these headers should be present
    expect(response.headers['x-ratelimit-limit']).toBeDefined()
    expect(response.headers['x-ratelimit-remaining']).toBeDefined()
  })
})
