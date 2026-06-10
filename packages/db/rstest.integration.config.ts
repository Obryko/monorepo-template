import { defineConfig } from '@rstest/core'

export default defineConfig({
  globals: false,
  testEnvironment: 'node',
  include: ['src/test/**/*.integration.{test,spec}.ts'],
  testTimeout: 60_000,
})
