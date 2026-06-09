import { contractSchemas } from '@monorepo-template/contracts'
import type { OpenAPIObject } from '@nestjs/swagger'
import { createSchema } from 'zod-openapi'

type SchemasMap = NonNullable<NonNullable<OpenAPIObject['components']>['schemas']>
type SchemaEntry = SchemasMap[string]

export function injectContractSchemas(document: OpenAPIObject): void {
  document.components ??= {}
  document.components.schemas ??= {}

  for (const [name, zodSchema] of Object.entries(contractSchemas)) {
    const { schema, components } = createSchema(zodSchema)
    document.components.schemas[name] = schema as SchemaEntry
    if (components) {
      Object.assign(document.components.schemas, components as Record<string, SchemaEntry>)
    }
  }
}
