import { extractCorrelationId } from '@monorepo-template/observability'
import { defineEventHandler, setResponseHeader } from 'h3'

export default defineEventHandler((event) => {
  const headers = Object.fromEntries(event.req.headers.entries())
  const correlationId = extractCorrelationId(headers)
  event.context.correlationId = correlationId
  setResponseHeader(event, 'x-request-id', correlationId)
})
