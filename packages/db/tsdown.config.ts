import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: { index: './src/index.ts' },
  format: ['esm'],
  dts: { sourcemap: true },
  sourcemap: true,
  clean: true,
  deps: {
    neverBundle: ['drizzle-orm', 'postgres'],
  },
})
