import { defineConfig } from 'tsup'
import packageJson from './package.json'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: true, // Code splitting para chunks otimizados
  treeshake: true, // Tree-shaking agressivo
  minify: false, // Não minificar (bundlers dos consumidores farão isso)
  sourcemap: false,
  target: 'es2020',
  outDir: 'dist',
  // Injetar versão do package.json em build time
  define: {
    __LIBRARY_VERSION__: JSON.stringify(packageJson.version),
  },
  // Evitar external de React/MUI para análise correta de bundle
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    '@mui/material',
    '@emotion/react',
    '@emotion/styled',
    'js-cookie',
  ],
  // Banner para avisar sobre tree-shaking
  banner: {
    js: '// react-lgpd-consent - Tree-shakeable ESM build',
  },
  // Configuração para evitar warnings de side-effects
  esbuildOptions(options) {
    options.legalComments = 'none'
  },
})
