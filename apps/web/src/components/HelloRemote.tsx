import { lazy } from 'react'

const HelloRemote = lazy(() => import('remote/HelloRemote'))

export default HelloRemote
