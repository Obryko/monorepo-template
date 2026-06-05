import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: false,
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
    typecheck: {
      enabled: true,
      checker: 'tsc',
      tsconfig: './tsconfig.test.json',
    },
  },
})
