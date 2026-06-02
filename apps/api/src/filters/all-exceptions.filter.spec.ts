import { HttpException, HttpStatus, Logger } from '@nestjs/common'
import { describe, expect, it, vi } from 'vitest'
import { AllExceptionsFilter } from './all-exceptions.filter.ts'

function makeContext() {
  const send = vi.fn()
  const status = vi.fn().mockReturnValue({ send })
  const getResponse = vi.fn().mockReturnValue({ status })
  const getRequest = vi.fn().mockReturnValue({ url: '/test', method: 'GET' })
  return { switchToHttp: () => ({ getResponse, getRequest }) } as never
}

describe('AllExceptionsFilter', () => {
  const logger = new Logger()

  it('maps HttpException to its status + message', () => {
    const filter = new AllExceptionsFilter(logger)
    const ctx = makeContext()
    const exc = new HttpException('Bad Request', HttpStatus.BAD_REQUEST)
    filter.catch(exc, ctx)
    const { send, status } = getCallArgs(ctx)
    expect(status).toHaveBeenCalledWith(400)
    expect(send).toHaveBeenCalledWith({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Bad Request',
    })
  })

  it('maps unknown error to 500', () => {
    const filter = new AllExceptionsFilter(logger)
    const ctx = makeContext()
    filter.catch(new Error('boom'), ctx)
    const { send, status } = getCallArgs(ctx)
    expect(status).toHaveBeenCalledWith(500)
    expect(send).toHaveBeenCalledWith({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Internal Server Error',
    })
  })
})

function getCallArgs(ctx: ReturnType<typeof makeContext>) {
  const res = ctx.switchToHttp().getResponse()
  const status = res.status
  const send = status.mock.results[0].value.send
  return { send, status }
}
