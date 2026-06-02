import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: { index: './src/index.ts' },
  format: ['esm'],
  dts: { sourcemap: true },
  sourcemap: true,
  clean: true,
  jsx: 'react-jsx',
  deps: {
    neverBundle: ['react', 'react-dom'],
  },
})
