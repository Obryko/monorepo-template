import { beforeEach, describe, expect, it, rstest } from '@rstest/core'

rstest.mock('@sentry/nestjs', { spy: true })

import * as Sentry from '@sentry/nestjs'
import { SentryExceptionFilter } from '../nest/sentry-exception.filter.ts'

describe('SentryExceptionFilter', () => {
  let filter: SentryExceptionFilter

  beforeEach(() => {
    filter = new SentryExceptionFilter()
    rstest.clearAllMocks()
  })

  it('captures non-HTTP exceptions to Sentry', () => {
    const captureSpy = rstest.spyOn(Sentry, 'captureException')
    const err = new Error('boom')
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({ status: () => ({ json: rstest.fn() }) }),
        getRequest: () => ({ url: '/test' }),
      }),
      getType: () => 'http',
    } as never

    filter.catch(err, host)

    expect(captureSpy).toHaveBeenCalledWith(err)
  })

  it('does not capture 4xx HttpException', async () => {
    const captureSpy = rstest.spyOn(Sentry, 'captureException')
    const { HttpException } = await import('@nestjs/common')
    const err = new HttpException('not found', 404)
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({ status: () => ({ json: rstest.fn() }) }),
        getRequest: () => ({ url: '/test' }),
      }),
      getType: () => 'http',
    } as never

    filter.catch(err, host)

    expect(captureSpy).not.toHaveBeenCalled()
  })
})
