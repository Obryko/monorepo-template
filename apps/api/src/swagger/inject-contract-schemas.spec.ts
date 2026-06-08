import type { OpenAPIObject } from '@nestjs/swagger'
import { describe, expect, it } from '@rstest/core'
import { injectContractSchemas } from './inject-contract-schemas'

function emptyDocument(): OpenAPIObject {
  return {
    openapi: '3.0.0',
    info: { title: 'test', version: '1.0' },
    paths: {},
  }
}

describe('injectContractSchemas', () => {
  it('registers Greeting under components.schemas', () => {
    const doc = emptyDocument()
    injectContractSchemas(doc)
    expect(doc.components?.schemas?.Greeting).toBeDefined()
  })

  it('preserves preexisting components.schemas entries', () => {
    const doc = emptyDocument()
    doc.components = { schemas: { Existing: { type: 'string' } } }
    injectContractSchemas(doc)
    expect(doc.components?.schemas?.Existing).toEqual({ type: 'string' })
    expect(doc.components?.schemas?.Greeting).toBeDefined()
  })

  it('attaches schema metadata from .meta()', () => {
    const doc = emptyDocument()
    injectContractSchemas(doc)
    const greeting = doc.components?.schemas?.Greeting as { description?: string; example?: string }
    expect(greeting.description).toContain('greeting')
    expect(greeting.example).toBe('Hello World!')
  })
})
