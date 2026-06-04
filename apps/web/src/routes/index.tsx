import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import HelloRemote from '#/components/HelloRemote'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <p className="mt-4 text-lg">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>
      <Suspense fallback={<p className="mt-4 text-sm text-gray-500">Loading remote…</p>}>
        <HelloRemote />
      </Suspense>
    </div>
  )
}
