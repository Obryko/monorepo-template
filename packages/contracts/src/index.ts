import 'zod-openapi'
import { z } from 'zod'

export const GreetingSchema: z.ZodType<string> = z.string().meta({
  id: 'Greeting',
  description: 'A plain-text greeting string returned by the root endpoint',
  example: 'Hello World!',
})

export type Greeting = z.infer<typeof GreetingSchema>

export const UserSchema: z.ZodType<{
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
}> = z
  .object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .meta({ id: 'User', description: 'A user in the system' })

export type User = z.infer<typeof UserSchema>

export const UserListSchema: z.ZodType<
  Array<{
    id: string
    email: string
    name: string
    createdAt: string
    updatedAt: string
  }>
> = z.array(UserSchema).meta({
  id: 'UserList',
  description: 'List of users',
})

export type UserList = z.infer<typeof UserListSchema>

export const contractSchemas: Readonly<Record<string, z.ZodType>> = {
  Greeting: GreetingSchema,
  User: UserSchema,
  UserList: UserListSchema,
}
