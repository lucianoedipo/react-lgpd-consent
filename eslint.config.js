// eslint.config.js

// Storybook: import dinâmico (seguro para CI)
let storybook = null
try {
  const mod = await import('eslint-plugin-storybook')
  storybook = mod.default ?? mod
} catch {
  storybook = null
}

import pluginJs from '@eslint/js'
import prettier from 'eslint-config-prettier'
import jestPlugin from 'eslint-plugin-jest'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import { dirname } from 'path'
import tseslint from 'typescript-eslint'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const jestFlat = jestPlugin.configs?.['flat/recommended'] ?? {}

export default [
  // Ignorar primeiro
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'example/**',
      'docs/**',
      'storybook-static/**',
      '.vite/**',
      'build/**',
      'out/**',
      '.cache/**',
      '.turbo/**',
      'storybook/**',
      '.stryker-tmp/**',
    ],
  },

  // Regras base JS (Flat)
  pluginJs.configs.recommended,

  // Base TS (sem type-checking)
  ...tseslint.configs.recommended,

  // Código da lib (produção)
  {
    files: ['packages/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        tsconfigRootDir: __dirname,
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        console: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
    },
    rules: {
      // Hooks
      ...reactHooks.configs.recommended.rules,

      // Qualidade
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-ignore': 'allow-with-description', minimumDescriptionLength: 3 },
      ],
      '@typescript-eslint/no-require-imports': 'error',
      'no-inner-declarations': 'off',

      // Estilo
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
    },
  },

  // Testes (Jest) e arquivos de setup/config
  {
    files: [
      '**/*.{test,spec}.{ts,tsx,js,jsx}',
      '**/jest*.{ts,tsx,js,jsx}',
      'jest.config.{ts,js}',
      '**/jest/**/*.{ts,tsx,js,jsx}',
    ],
    ...jestFlat,
    languageOptions: {
      ...jestFlat.languageOptions,
      globals: { ...(jestFlat.languageOptions?.globals ?? {}), ...globals.jest, ...globals.node },
    },
    plugins: { ...(jestFlat.plugins ?? {}), jest: jestPlugin },
    rules: {
      ...(jestFlat.rules ?? {}),
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      // Arquivos de setup podem ter variáveis/erros capturados não utilizados
      '@typescript-eslint/no-unused-vars': 'off',
      // Em testes permitimos any para simplificar mocks e espiões
      '@typescript-eslint/no-explicit-any': 'off',
      // Comentários ts em testes ficam como aviso
      '@typescript-eslint/ban-ts-comment': 'warn',
    },
  },

  // Storybook (se disponível)
  ...(storybook?.configs?.['flat/recommended']
    ? [
        {
          files: ['**/*.stories.{ts,tsx}'],
          rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
          },
        },
        ...storybook.configs['flat/recommended'],
      ]
    : []),

  // Declarações
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },

  // Scripts de build/CI (Node.js puro)
  {
    files: ['scripts/**/*.{js,cjs,mjs}', 'scripts/**/*.ts'],
    languageOptions: {
      globals: { ...globals.node },
      ecmaVersion: 2022,
      sourceType: 'script', // Para .cjs files
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'no-console': 'off', // Scripts podem usar console
      '@typescript-eslint/no-unused-vars': 'off', // Para exports condicionais
    },
  },

  // Desativa regras que conflitam com o Prettier
  prettier,
]
