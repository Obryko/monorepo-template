import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [swc.vite()],
  test: {
    name: 'api-e2e',
    environment: 'node',
    globals: false,
    include: ['test/**/*.{test,spec}.ts'],
    exclude: ['src/**/*.{test,spec}.ts'],
    hookTimeout: 30_000,
    testTimeout: 30_000,
    clearMocks: true,
    restoreMocks: true,
    fileParallelism: false,
  },
})
