import { AsyncLocalStorage } from 'node:async_hooks'
import { Injectable, type NestMiddleware } from '@nestjs/common'
import { extractCorrelationId } from '../correlation.ts'

export const correlationStorage: AsyncLocalStorage<string> = new AsyncLocalStorage<string>()

@Injectable()
export class CorrelationMiddleware implements NestMiddleware {
  use(
    req: { headers: Record<string, string | string[] | undefined> },
    res: { setHeader: (key: string, value: string) => void },
    next: () => void,
  ): void {
    const correlationId = extractCorrelationId(req.headers)
    res.setHeader('x-request-id', correlationId)
    correlationStorage.run(correlationId, next)
  }
}
