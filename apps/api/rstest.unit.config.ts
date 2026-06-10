import { defineConfig } from '@rstest/core'

export default defineConfig({
  globals: false,
  testEnvironment: 'node',
  include: ['src/**/*.{test,spec}.ts'],
  exclude: ['test/**/*.{test,spec}.ts'],
  clearMocks: true,
  restoreMocks: true,
  env: {
    DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/postgres',
  },
  source: {
    decorators: {
      version: 'legacy',
    },
  },
})
