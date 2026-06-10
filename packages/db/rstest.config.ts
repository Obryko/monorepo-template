import { defineConfig } from '@rstest/core'

export default defineConfig({
  globals: false,
  testEnvironment: 'node',
  include: ['src/test/**/*.{test,spec}.ts'],
  exclude: ['src/test/**/*.integration.{test,spec}.ts'],
})
