import { defineConfig } from '@rstest/core'

export default defineConfig({
  globals: false,
  testEnvironment: 'happy-dom',
  tools: {
    swc: {
      jsc: {
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
    },
  },
})
