import { ClientOnly, createFileRoute, Link } from '@tanstack/react-router'
import { Suspense } from 'react'
import HelloRemote from '#/components/HelloRemote'
import { RemoteErrorBoundary } from '#/components/RemoteErrorBoundary'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const fallback = <p className="mt-4 text-sm text-gray-500">Loading remote…</p>
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <p className="mt-4 text-lg">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>
      <Link to="/users" className="mt-4 inline-block text-blue-600 hover:underline">
        View Users →
      </Link>
      <ClientOnly fallback={fallback}>
        <RemoteErrorBoundary
          fallback={<p className="mt-4 text-sm text-gray-500">Remote unavailable</p>}
        >
          <Suspense fallback={fallback}>
            <HelloRemote />
          </Suspense>
        </RemoteErrorBoundary>
      </ClientOnly>
    </div>
  )
}
