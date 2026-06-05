import { defineConfig } from '@rstest/core'

export default defineConfig({
  globals: false,
  testEnvironment: 'node',
  include: ['src/**/*.{test,spec}.ts'],
  exclude: ['test/**/*.{test,spec}.ts'],
  clearMocks: true,
  restoreMocks: true,
  source: {
    decorators: {
      version: 'legacy',
    },
  },
})
