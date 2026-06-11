import { type UserList, UserListSchema } from '@monorepo-template/contracts'
import { Card, CardContent, CardHeader, CardTitle } from '@monorepo-template/ui'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { clientEnv } from '#/env/client'

export const Route = createFileRoute('/users')({
  component: UsersPage,
})

function UsersPage() {
  const [users, setUsers] = useState<UserList>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${clientEnv.PUBLIC_API_URL}/users`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch users')
        return UserListSchema.parse(await res.json())
      })
      .then(setUsers)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unknown error'))
  }, [])

  if (error) {
    return (
      <div className="p-8">
        <h1 className="mb-6 text-4xl font-bold">Users</h1>
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-4xl font-bold">Users</h1>
      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
