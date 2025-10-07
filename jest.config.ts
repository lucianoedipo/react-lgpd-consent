import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // Reduz paralelismo e consumo para evitar travamentos em ambientes limitados (ex.: WSL)
  maxWorkers: '50%',
  testTimeout: 30000,
  workerIdleMemoryLimit: '512MB',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: { '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }] },
  // Use an early setup file to silence console output during module collection,
  // and keep the regular setup for testing-library and Jest helpers.
  setupFiles: ['<rootDir>/jest.console-setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/?(*.)+(test|spec).+(ts|tsx)'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/@types/**',
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
