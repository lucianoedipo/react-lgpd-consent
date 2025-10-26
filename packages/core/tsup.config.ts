import { defineConfig } from 'tsup'
import packageJson from './package.json'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: true,
  treeshake: true,
  minify: false,
  sourcemap: false,
  target: 'es2020',
  outDir: 'dist',
  define: {
    __LIBRARY_VERSION__: JSON.stringify(packageJson.version),
  },
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    'js-cookie'
  ],
  banner: {
    js: '// @react-lgpd-consent/core - Tree-shakeable ESM build'
  },
  esbuildOptions(options) {
    options.legalComments = 'none'
  }
})
