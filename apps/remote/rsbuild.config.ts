import { pluginModuleFederation } from '@module-federation/rsbuild-plugin'
import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

export default defineConfig({
  server: {
    port: 3001,
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'remote',
      filename: 'remoteEntry.js',
      exposes: {
        './HelloRemote': './src/HelloRemote.tsx',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
      },
    }),
  ],
})
