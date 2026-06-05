import '@testing-library/jest-dom'
import { afterEach } from '@rstest/core'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})
