import http from 'node:http'
import { captureException } from '@monorepo-template/sentry'
import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import type { FastifyReply } from 'fastify'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()

    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const error = http.STATUS_CODES[statusCode] ?? 'Internal Server Error'

    const message =
      statusCode === HttpStatus.INTERNAL_SERVER_ERROR
        ? 'Internal Server Error'
        : exception instanceof HttpException
          ? exception.message
          : 'Internal Server Error'

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      const msg = exception instanceof Error ? exception.message : String(exception)
      const stack = exception instanceof Error ? exception.stack : undefined
      this.logger.error(msg, stack)
      captureException(exception)
    }

    void response.status(statusCode).send({ statusCode, error, message })
  }
}
