import { lazy } from 'react'

const HelloRemote = Object.assign(
  lazy(() =>
    import('remote/HelloRemote').catch(() => ({
      default: () => <div>Remote unavailable</div>,
    })),
  ),
  { displayName: 'HelloRemote' },
)

export default HelloRemote
