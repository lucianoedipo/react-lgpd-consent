/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // alias oficial do ambiente
  roots: ['<rootDir>/src'], // foca nos testes da lib
  testMatch: ['**/?(*.)+(test|spec).+(ts|tsx)'], // TS/TSX
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // ver passo 3
  // Se o seu package.json tiver "type": "module" e você quiser tratar TS como ESM:
  // extensionsToTreatAsEsm: ['.ts', '.tsx'],
}
