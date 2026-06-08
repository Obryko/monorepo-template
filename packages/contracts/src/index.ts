import 'zod-openapi'
import { z } from 'zod'

export const GreetingSchema: z.ZodType<string> = z.string().meta({
  id: 'Greeting',
  description: 'A plain-text greeting string returned by the root endpoint',
  example: 'Hello World!',
})

export type Greeting = string

export const contractSchemas: Readonly<Record<string, z.ZodType>> = {
  Greeting: GreetingSchema,
}
