// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import * as globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginJest from 'eslint-plugin-jest'
import prettierConfig from 'eslint-config-prettier'

export default [{
  files: ['**/*.{js,mjs,cjs,ts,tsx}'],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      ecmaFeatures: { jsx: true },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    globals: { ...globals.browser, ...globals.node, console: 'readonly' },
  },
  plugins: {
    '@eslint/js': pluginJs,
    '@typescript-eslint': tseslint.plugin,
    'react-hooks': pluginReactHooks,
  },
  rules: {
    ...pluginJs.configs.recommended.rules,
    ...tseslint.configs.recommended.rules,
    ...pluginReactHooks.configs.recommended.rules,
    ...prettierConfig.rules,
    'no-undef': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrors: 'none',
      },
    ],
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
  },
}, {
  files: ['**/*.test.{ts,tsx}'],
  ...pluginJest.configs['flat/recommended'],
  languageOptions: { globals: globals.jest },
}, {
  files: ['**/*.test.{ts,tsx,js,jsx}'],
  languageOptions: { globals: globals.jest },
}, { ignores: ['dist/', 'node_modules/', 'example/', 'docs/'] }, ...storybook.configs["flat/recommended"]];
