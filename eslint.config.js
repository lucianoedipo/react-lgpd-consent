import * as globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import prettierConfig from 'eslint-config-prettier'

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: true, // Explicitly define React global
        console: true, // Explicitly define console global
        window: true, // Explicitly define window global
        document: true, // Explicitly define document global
        setTimeout: true, // Explicitly define setTimeout global
      },
    },
    plugins: {
      '@eslint/js': pluginJs,
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': pluginReactHooks,
    },
    rules: {
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      'react-hooks/exhaustive-deps': 'warn',
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...prettierConfig.rules, // Move prettierConfig.rules to the end
    },
  },
  {
    ignores: ['dist/', 'node_modules/', 'example/'], // Add ignores property as a separate config object
  },
]
