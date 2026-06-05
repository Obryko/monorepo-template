import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import HelloRemote from './HelloRemote'

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <StrictMode>
      <HelloRemote />
    </StrictMode>,
  )
}
