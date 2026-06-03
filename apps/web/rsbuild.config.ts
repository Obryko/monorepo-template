import { pluginModuleFederation } from '@module-federation/rsbuild-plugin'
import { defineConfig } from '@rsbuild/core'
import { pluginBabel } from '@rsbuild/plugin-babel'
import { pluginReact } from '@rsbuild/plugin-react'
import tailwindcss from '@tailwindcss/postcss'
import { tanstackStart } from '@tanstack/react-start/plugin/rsbuild'

export default defineConfig({
  plugins: [
    tanstackStart(),
    pluginReact(),
    pluginBabel({
      include: /\.(?:tsx|ts|jsx|js)$/,
      babelLoaderOptions(opts) {
        opts.plugins ??= []
        opts.plugins.unshift('babel-plugin-react-compiler')
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
