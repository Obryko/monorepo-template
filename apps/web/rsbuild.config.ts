import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginBabel } from '@rsbuild/plugin-babel'
import { tanstackStart } from '@tanstack/react-start/plugin/rsbuild'
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin'
import tailwindcss from '@tailwindcss/postcss'

export default defineConfig({
  plugins: [
    tanstackStart(),
    pluginReact(),
    pluginBabel({
      include: /\.(?:tsx|ts|jsx|js)$/,
      babelLoaderOptions(opts) {
        opts.plugins?.unshift('babel-plugin-react-compiler')
      },
    }),
    pluginModuleFederation({
      name: 'shell',
      filename: 'remoteEntry.js',
      remotes: {},
      shared: {
        react: { singleton: true, eager: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, eager: true, requiredVersion: '^19.0.0' },
      },
    }),
  ],
  source: {
    tsconfigPath: './tsconfig.json',
  },
  tools: {
    postcss: {
      postcssOptions: {
        plugins: [tailwindcss()],
      },
    },
  },
})
