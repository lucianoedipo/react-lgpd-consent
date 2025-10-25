import '@testing-library/jest-dom'
import { toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

// Mock global __LIBRARY_VERSION__ que é injetada em build time via tsup.define
declare global {
  var __LIBRARY_VERSION__: string
}
globalThis.__LIBRARY_VERSION__ = '0.4.5-test'
