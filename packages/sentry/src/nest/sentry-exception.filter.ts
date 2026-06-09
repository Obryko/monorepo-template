import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common'
import { captureException } from '@sentry/nestjs'

interface ResponseLike {
  status: (n: number) => ResponseLike
  send?: (body: unknown) => unknown
  json?: (body: unknown) => unknown
}

function sendResponse(res: ResponseLike, status: number, body: unknown): void {
  const target = res.status(status)
  if (typeof target.send === 'function') {
    target.send(body)
    return
  }
  if (typeof target.json === 'function') {
    target.json(body)
  }
}

@Catch()
export class SentryExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(SentryExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    if (exception instanceof HttpException && exception.getStatus() < 500) {
      this.forwardHttpException(exception, host)
      return
    }

    captureException(exception)
    const msg = exception instanceof Error ? exception.message : String(exception)
    const stack = exception instanceof Error ? exception.stack : undefined
    this.logger.error(msg, stack)

    if (host.getType() !== 'http') {
      throw exception
    }

    const res = host.switchToHttp().getResponse<ResponseLike>()
    sendResponse(res, 500, { statusCode: 500, error: 'Internal Server Error' })
  }

  private forwardHttpException(exception: HttpException, host: ArgumentsHost): void {
    if (host.getType() !== 'http') return
    const res = host.switchToHttp().getResponse<ResponseLike>()
    sendResponse(res, exception.getStatus(), exception.getResponse())
  }
}
