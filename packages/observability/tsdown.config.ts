import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: './src/index.ts',
    'browser/index': './src/browser/index.ts',
    'nest/index': './src/nest/index.ts',
  },
  format: ['esm'],
  dts: { sourcemap: true },
  sourcemap: true,
  clean: true,
  external: ['@nestjs/common', '@nestjs/core', 'nestjs-pino', 'pino-http'],
})
