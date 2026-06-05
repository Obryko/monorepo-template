import { lazy } from 'react'

const HelloRemote = Object.assign(
  lazy(() =>
    import('remote/HelloRemote').catch((error) => {
      if (import.meta.env.DEV) {
        console.error('Failed to load remote/HelloRemote:', error)
      }
      return { default: () => <div>Remote unavailable</div> }
    }),
  ),
  { displayName: 'HelloRemote' },
)

export default HelloRemote
