/**
 * @fileoverview
 * Testes para o sistema de diagnóstico de peer dependencies.
 *
 * @author Luciano Édipo
 * @since 0.5.4
 */

import { checkPeerDeps, runPeerDepsCheck } from '../peerDepsCheck'

describe('peerDepsCheck', () => {
  const originalWindow = global.window
  const originalProcess = global.process

  beforeEach(() => {
    // Reset window
    if (typeof window !== 'undefined') {
      delete (window as Window & { React?: unknown }).React
    }
  })

  afterEach(() => {
    global.window = originalWindow
    global.process = originalProcess
  })

  describe('checkPeerDeps', () => {
    it('deve retornar ok:true em ambiente SSR', () => {
      // @ts-expect-error - Simulando SSR
      global.window = undefined

      const result = checkPeerDeps()

      expect(result.ok).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.warnings).toHaveLength(0)
    })

    it('deve retornar ok:true quando não há problemas detectados', () => {
      const result = checkPeerDeps()

      expect(result.ok).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('deve pular verificação em produção por padrão', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      const result = checkPeerDeps()

      expect(result.ok).toBe(true)
      expect(result.errors).toHaveLength(0)

      process.env.NODE_ENV = originalEnv
    })

    it('deve executar verificação em produção quando skipInProduction=false', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      // Simular React com versão antiga
      // @ts-expect-error - Teste
      global.window.React = { version: '17.0.0' }

      const result = checkPeerDeps({ skipInProduction: false })

      expect(result.ok).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)

      process.env.NODE_ENV = originalEnv
    })

    it('deve detectar versão de React fora do range', () => {
      // @ts-expect-error - Teste
      global.window.React = { version: '17.0.0' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.ok).toBe(false)
      expect(result.errors.some((e) => e.includes('React'))).toBe(true)
    })

    it('deve aceitar React 18.x', () => {
      // @ts-expect-error - Teste
      global.window.React = { version: '18.2.0' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.ok).toBe(true)
    })

    it('deve aceitar React 19.x', () => {
      // @ts-expect-error - Teste
      global.window.React = { version: '19.0.0' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.ok).toBe(true)
    })

    it('deve avisar sobre versão de MUI fora do range', () => {
      // @ts-expect-error - Teste
      global.window['@mui/material'] = { version: '4.12.0' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.warnings.length).toBeGreaterThan(0)
      expect(result.warnings.some((w) => w.includes('MUI'))).toBe(true)
    })

    it('deve aceitar MUI 5.x', () => {
      // @ts-expect-error - Teste
      global.window['@mui/material'] = { version: '5.15.0' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.warnings).toHaveLength(0)
    })

    it('deve aceitar MUI 6.x', () => {
      // @ts-expect-error - Teste
      global.window['@mui/material'] = { version: '6.0.0' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.warnings).toHaveLength(0)
    })

    it('deve aceitar MUI 7.x', () => {
      // @ts-expect-error - Teste
      global.window['@mui/material'] = { version: '7.0.0' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.warnings).toHaveLength(0)
    })

    it('não deve logar quando logWarnings=false', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()

      // @ts-expect-error - Teste
      global.window.React = { version: '17.0.0' }

      checkPeerDeps({ logWarnings: false })

      expect(consoleErrorSpy).not.toHaveBeenCalled()
      expect(consoleWarnSpy).not.toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
      consoleWarnSpy.mockRestore()
    })
  })

  describe('runPeerDepsCheck', () => {
    it('deve executar verificação e não lançar erros', () => {
      expect(() => runPeerDepsCheck()).not.toThrow()
    })

    it('deve funcionar em ambiente SSR', () => {
      // @ts-expect-error - Simulando SSR
      global.window = undefined

      expect(() => runPeerDepsCheck()).not.toThrow()
    })
  })
})
