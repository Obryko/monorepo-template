import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common'
import { captureException } from '@sentry/nestjs'

@Catch()
export class SentryExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(SentryExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    if (exception instanceof HttpException && exception.getStatus() < 500) {
      this.forwardHttpException(exception, host)
      return
    }

    captureException(exception)
    this.logger.error(exception)

    if (host.getType() === 'http') {
      const ctx = host.switchToHttp()
      const res = ctx.getResponse<{ status: (n: number) => { json: (b: unknown) => void } }>()
      res.status(500).json({ statusCode: 500, error: 'Internal Server Error' })
    }
  }

  private forwardHttpException(exception: HttpException, host: ArgumentsHost): void {
    if (host.getType() !== 'http') return
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<{ status: (n: number) => { json: (b: unknown) => void } }>()
    res.status(exception.getStatus()).json(exception.getResponse())
  }
}
