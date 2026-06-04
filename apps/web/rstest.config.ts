import { defineConfig } from '@rstest/core'

export default defineConfig({
  testEnvironment: 'happy-dom',
  globals: false,
  include: ['src/**/*.{test,spec}.{ts,tsx}'],
  setupFiles: ['./src/test/setup.ts'],
})
