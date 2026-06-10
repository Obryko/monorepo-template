import { initClientSentry } from '@monorepo-template/sentry/client'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import HelloRemote from './HelloRemote'

initClientSentry({ dsn: (import.meta.env['PUBLIC_SENTRY_DSN'] as string | undefined) ?? '' })

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <StrictMode>
      <HelloRemote />
    </StrictMode>,
  )
}
