import { lazy } from 'react'

const HelloRemote = Object.assign(
  lazy(() => import('remote/HelloRemote')),
  {
    displayName: 'HelloRemote',
  },
)

export default HelloRemote
