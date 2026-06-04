import { lazy } from 'react'

const HelloRemote = lazy(() =>
  import('remote/HelloRemote').catch(() => ({
    default: () => <div>Remote unavailable</div>,
  })),
)

export default HelloRemote
