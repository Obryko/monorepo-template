import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [swc.vite()],
  test: {
    name: 'api-unit',
    environment: 'node',
    globals: false,
    include: ['src/**/*.{test,spec}.ts'],
    exclude: ['test/**/*.{test,spec}.ts'],
    clearMocks: true,
    restoreMocks: true,
  },
})
