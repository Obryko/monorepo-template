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
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const error =
      statusCode === HttpStatus.INTERNAL_SERVER_ERROR
        ? 'Internal Server Error'
        : (exception instanceof HttpException ? exception.message : 'Internal Server Error')

    const message =
      statusCode === HttpStatus.INTERNAL_SERVER_ERROR
        ? 'Internal Server Error'
        : (exception instanceof HttpException ? exception.message : 'Internal Server Error')

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception)
    }

    void response.status(statusCode).send({ statusCode, error, message })
  }
}
