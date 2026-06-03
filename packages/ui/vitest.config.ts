import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@monorepo-template/ui/src/lib/utils': path.resolve(
        import.meta.dirname,
        './src/lib/utils.ts',
      ),
      '@monorepo-template/ui/src/lib': path.resolve(import.meta.dirname, './src/lib'),
      '@monorepo-template/ui/src/components': path.resolve(import.meta.dirname, './src/components'),
    },
  },
  test: {
    environment: 'happy-dom',
    globals: false,
  },
})
