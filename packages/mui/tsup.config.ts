import { defineConfig } from 'tsup'
import packageJson from './package.json'

export default defineConfig({
  entry: ['src/index.ts', 'src/ui.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: false,
  treeshake: true,
  minify: false,
  sourcemap: false,
  target: 'es2020',
  outDir: 'dist',
  define: {
    __LIBRARY_VERSION__: JSON.stringify(packageJson.version)
  },
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    '@mui/material',
    '@mui/icons-material',
    '@react-lgpd-consent/core'
  ],
  banner: {
    js: '// @react-lgpd-consent/mui - proxy build'
  },
  esbuildOptions(options) {
    options.legalComments = 'none'
  }
})
