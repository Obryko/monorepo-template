import { defineConfig } from '@rstest/core'

export default defineConfig({
  globals: true,
  testEnvironment: 'node',
  include: ['src/test/**/*.{test,spec}.ts'],
})
