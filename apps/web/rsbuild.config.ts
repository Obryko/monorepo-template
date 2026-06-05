import { pluginModuleFederation } from '@module-federation/rsbuild-plugin'
import { defineConfig } from '@rsbuild/core'
import { pluginBabel } from '@rsbuild/plugin-babel'
import { pluginReact } from '@rsbuild/plugin-react'
import tailwindcss from '@tailwindcss/postcss'
import { tanstackStart } from '@tanstack/react-start/plugin/rsbuild'

export default defineConfig({
  plugins: [
    tanstackStart({
      // Repo uses Biome, not ESLint; drop the default eslint-disable header.
      router: {
        routeTreeFileHeader: ['// @ts-nocheck', '// noinspection JSUnusedGlobalSymbols'],
      },
    }),
    pluginReact(),
    pluginBabel({
      include: /\.(?:tsx|ts|jsx|js)$/,
      babelLoaderOptions(opts) {
        opts.plugins ??= []
        opts.plugins.unshift('babel-plugin-react-compiler')
      },
    }),
    // TanStack Start uses 'client' + 'ssr' environment names (not Rsbuild's default 'web').
    // Pass { environment: 'client' } so the MF plugin targets the right bundler config.
    pluginModuleFederation(
      {
        name: 'shell',
        filename: 'remoteEntry.js',
        remotes: {
          remote: `remote@${process.env['REMOTE_URL'] ?? 'http://localhost:3002'}/remoteEntry.js`,
        },
        shared: {
          react: { singleton: true, requiredVersion: '^19.0.0' },
          'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        },
      },
      { environment: 'client' },
    ),
  ],
  // SSR build doesn't run remote MF modules (React.lazy + Suspense renders the fallback).
  // Externalize the remote import so rspack doesn't fail trying to bundle it server-side.
  environments: {
    ssr: {
      output: {
        externals: {
          'remote/HelloRemote': 'commonjs remote/HelloRemote',
        },
      },
    },
  },
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
