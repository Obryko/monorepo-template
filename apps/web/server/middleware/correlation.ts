import { extractCorrelationId } from '@monorepo-template/observability'
import { defineEventHandler, getRequestHeaders, setResponseHeader } from 'h3'

export default defineEventHandler((event) => {
  const correlationId = extractCorrelationId(getRequestHeaders(event))
  event.context['correlationId'] = correlationId
  setResponseHeader(event, 'x-request-id', correlationId)
})
