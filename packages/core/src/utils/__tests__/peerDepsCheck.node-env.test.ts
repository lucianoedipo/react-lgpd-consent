/**
 * @jest-environment node
 */

import { checkPeerDeps } from '../peerDepsCheck'

describe('peerDepsCheck em ambiente node (sem window)', () => {
  it('deve retornar resultado vazio quando window é indefinido', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'test'

    const result = checkPeerDeps({ skipInProduction: false, logWarnings: false })

    expect(result.ok).toBe(true)
    expect(result.errors).toHaveLength(0)
    expect(result.warnings).toHaveLength(0)

    process.env.NODE_ENV = originalEnv
  })
})
