import { defineConfig } from '@rstest/core'

export default defineConfig({
  globals: false,
  testEnvironment: 'node',
  include: ['test/**/*.{test,spec}.ts'],
  exclude: ['src/**/*.{test,spec}.ts'],
  hookTimeout: 30_000,
  testTimeout: 30_000,
  clearMocks: true,
  restoreMocks: true,
  pool: {
    maxWorkers: 1,
  },
  source: {
    decorators: {
      version: 'legacy',
    },
  },
})
