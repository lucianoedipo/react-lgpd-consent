/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // Reduz paralelismo e consumo para evitar travamentos em ambientes limitados (ex.: WSL)
  maxWorkers: '50%',
  testTimeout: 30000,
  workerIdleMemoryLimit: '512MB',
  roots: ['<rootDir>/packages/core/src', '<rootDir>/packages/mui/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.base.json' }],
  },
  moduleNameMapper: {
    '^@react-lgpd-consent/core$': '<rootDir>/packages/core/src',
    '^@react-lgpd-consent/core/(.*)$': '<rootDir>/packages/core/src/$1',
    '^@react-lgpd-consent/mui$': '<rootDir>/packages/mui/src',
    '^@react-lgpd-consent/mui/(.*)$': '<rootDir>/packages/mui/src/$1',
    '^react-lgpd-consent$': '<rootDir>/packages/react-lgpd-consent/src',
    '^react-lgpd-consent/(.*)$': '<rootDir>/packages/react-lgpd-consent/src/$1',
  },
  // Use an early setup file to silence console output during module collection,
  // and keep the regular setup for testing-library and Jest helpers.
  setupFiles: ['<rootDir>/jest.console-setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/?(*.)+(test|spec).+(ts|tsx)'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  // Coverage configuration
  collectCoverageFrom: [
    'packages/core/src/**/*.{ts,tsx}',
    'packages/mui/src/**/*.{ts,tsx}',
    '!packages/**/src/**/*.stories.{ts,tsx}',
    '!packages/**/src/**/*.test.{ts,tsx}',
    '!packages/**/src/**/*.spec.{ts,tsx}',
    '!packages/**/src/@types/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'json-summary', 'html'],
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 80,
      functions: 70,
      lines: 85,
    },
  },
}

export default config
