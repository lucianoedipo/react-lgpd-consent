import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: { '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }] },
  // Use an early setup file to silence console output during module collection,
  // and keep the regular setup for testing-library and Jest helpers.
  setupFiles: ['<rootDir>/jest.console-setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/?(*.)+(test|spec).+(ts|tsx)'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
}

export default config
