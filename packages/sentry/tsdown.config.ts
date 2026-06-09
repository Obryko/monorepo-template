import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: './src/nest/index.ts',
    outDir: './dist/nest',
    format: 'esm',
    dts: true,
    sourcemap: true,
    external: ['@nestjs/common', '@nestjs/core', 'reflect-metadata'],
  },
  {
    entry: './src/client/index.ts',
    outDir: './dist/client',
    format: 'esm',
    dts: true,
    sourcemap: true,
    external: ['react', 'react-dom'],
  },
])
