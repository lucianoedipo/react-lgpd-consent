import { defineConfig } from 'tsup'
import packageJson from './package.json'

export default defineConfig({
  entry: ['src/index.ts', 'src/core.ts', 'src/mui.ts'],
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
    __LIBRARY_VERSION__: JSON.stringify(packageJson.version)
  },
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    '@react-lgpd-consent/core',
    '@react-lgpd-consent/mui'
  ],
  banner: {
    js: '// react-lgpd-consent aggregate build'
  },
  esbuildOptions(options) {
    options.legalComments = 'none'
  }
})
