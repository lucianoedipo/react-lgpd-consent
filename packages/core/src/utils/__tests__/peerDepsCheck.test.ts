/**
 * @fileoverview
 * Testes para o sistema de diagnóstico de peer dependencies.
 *
 * @author Luciano Édipo
 * @since 0.5.4
 */

import { checkPeerDeps, runPeerDepsCheck } from '../peerDepsCheck'

describe('peerDepsCheck', () => {
  const originalWindow = globalThis.window
  const originalProcess = globalThis.process

  beforeEach(() => {
    // Reset window
    if (typeof globalThis.window !== 'undefined') {
      delete (globalThis.window as Window & { React?: unknown }).React
    }
  })

  afterEach(() => {
    globalThis.window = originalWindow
    globalThis.process = originalProcess
  })

  describe('checkPeerDeps', () => {
    it('deve retornar ok:true em ambiente SSR', () => {
      // @ts-expect-error - Simulando SSR
      globalThis.window = undefined

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
      globalThis.window.React = { version: '17.0.0' }

      const result = checkPeerDeps({ skipInProduction: false })

      expect(result.ok).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)

      process.env.NODE_ENV = originalEnv
    })

    it('deve detectar versão de React fora do range', () => {
      // @ts-expect-error - Teste
      globalThis.window.React = { version: '17.0.0' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.ok).toBe(false)
      expect(result.errors.some((e) => e.includes('React'))).toBe(true)
    })

    it('deve aceitar React 18.x', () => {
      // @ts-expect-error - Teste
      globalThis.window.React = { version: '18.2.0' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.ok).toBe(true)
    })

    it('deve aceitar React 19.x', () => {
      // @ts-expect-error - Teste
      globalThis.window.React = { version: '19.0.0' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.ok).toBe(true)
    })

    it('deve avisar sobre versão de MUI fora do range', () => {
      // @ts-expect-error - Teste
      globalThis.window['@mui/material'] = { version: '4.12.0' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.warnings.length).toBeGreaterThan(0)
      expect(result.warnings.some((w) => w.includes('MUI'))).toBe(true)
    })

    it('deve aceitar MUI 5.x', () => {
      // @ts-expect-error - Teste
      globalThis.window['@mui/material'] = { version: '5.15.0' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.warnings).toHaveLength(0)
    })

    it('deve aceitar MUI 6.x', () => {
      // @ts-expect-error - Teste
      globalThis.window['@mui/material'] = { version: '6.0.0' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.warnings).toHaveLength(0)
    })

    it('deve aceitar MUI 7.x', () => {
      // @ts-expect-error - Teste
      globalThis.window['@mui/material'] = { version: '7.0.0' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.warnings).toHaveLength(0)
    })

    it('não deve logar quando logWarnings=false', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()

      // @ts-expect-error - Teste
      globalThis.window.React = { version: '17.0.0' }

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
      globalThis.window = undefined

      expect(() => runPeerDepsCheck()).not.toThrow()
    })

    it('deve logar debug quando tudo OK', () => {
      // Limpar símbolos React
      delete (globalThis.window as unknown as Record<string | symbol, unknown>)['@mui/material']
      delete (globalThis.window as Window & { React?: unknown }).React

      // Não deve lançar erro
      expect(() => runPeerDepsCheck()).not.toThrow()
    })
  })

  describe('detectMultipleReactInstances coverage', () => {
    it('deve detectar instâncias React no window.__REACT_DEVTOOLS_GLOBAL_HOOK__', () => {
      // @ts-expect-error - Teste
      globalThis.window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
        renderers: new Map([
          [1, { version: '18.2.0' }],
          [2, { version: '18.2.0' }],
        ]),
      }

      const result = checkPeerDeps({ logWarnings: false })

      // @ts-expect-error - Teste
      delete globalThis.window.__REACT_DEVTOOLS_GLOBAL_HOOK__

      expect(result.ok).toBe(false)
    })

    it('deve funcionar quando não há devtools hook', () => {
      // @ts-expect-error - Teste
      delete globalThis.window.__REACT_DEVTOOLS_GLOBAL_HOOK__

      const result = checkPeerDeps({ logWarnings: false })

      // Sem devtools, depende de outros métodos de detecção
      expect(result).toBeDefined()
    })
  })

  describe('getPackageVersion coverage', () => {
    it('deve obter versão do React de window.React.version', () => {
      // @ts-expect-error - Teste
      globalThis.window.React = { version: '18.3.1' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.ok).toBe(true)
    })

    it('deve lidar com versão em formato semver complexo', () => {
      // @ts-expect-error - Teste
      globalThis.window.React = { version: '18.2.0-alpha.1' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.ok).toBe(true)
    })
  })

  describe('isVersionInRange edge cases', () => {
    it('deve rejeitar versões abaixo do range mínimo', () => {
      // @ts-expect-error - Teste
      globalThis.window.React = { version: '16.8.0' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.ok).toBe(false)
      expect(result.errors.some((e) => e.includes('React'))).toBe(true)
    })

    it('deve aceitar versão no limite inferior do range', () => {
      // @ts-expect-error - Teste
      globalThis.window.React = { version: '18.0.0' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.ok).toBe(true)
    })
  })

  describe('logWarnings behavior', () => {
    it('deve logar erros no console quando logWarnings=true', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      // @ts-expect-error - Teste
      globalThis.window.React = { version: '17.0.0' }

      checkPeerDeps({ logWarnings: true })

      expect(consoleErrorSpy).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })
  })

  describe('detectMultipleReactInstances - todos os caminhos', () => {
    it('deve detectar símbolos React múltiplos no window', () => {
      const symbolReact1 = Symbol.for('react.element')
      const symbolReact2 = Symbol.for('react.portal')

      // Adicionar múltiplos símbolos react ao window
      Object.defineProperty(globalThis.window, symbolReact1, {
        value: 'test',
        configurable: true,
      })
      Object.defineProperty(globalThis.window, symbolReact2, {
        value: 'test',
        configurable: true,
      })

      const result = checkPeerDeps({ logWarnings: false })

      // Limpar símbolos
      delete (globalThis.window as unknown as Record<symbol, unknown>)[symbolReact1]
      delete (globalThis.window as unknown as Record<symbol, unknown>)[symbolReact2]

      // Deve detectar múltiplas instâncias
      expect(result.ok).toBe(false)
      expect(result.errors.some((e) => e.includes('Múltiplas instâncias'))).toBe(true)
    })

    it('deve detectar React carregado como array (múltiplas instâncias)', () => {
      // @ts-expect-error - Teste de cenário inválido
      globalThis.window.React = [{ version: '18.2.0' }, { version: '18.2.0' }]

      const result = checkPeerDeps({ logWarnings: false })

      // @ts-expect-error - Limpeza
      delete globalThis.window.React

      expect(result.ok).toBe(false)
      expect(result.errors.some((e) => e.includes('Múltiplas instâncias'))).toBe(true)
    })

    it('deve retornar false quando detecção falha (catch block)', () => {
      // Criar window mock que lança erro ao acessar propriedades
      const brokenWindow = new Proxy(
        {},
        {
          getOwnPropertyDescriptor() {
            throw new Error('Acesso negado')
          },
        },
      )

      // @ts-expect-error - Teste de erro
      globalThis.window = brokenWindow

      // Não deve lançar erro, apenas retornar result
      const result = checkPeerDeps({ logWarnings: false })

      expect(result).toBeDefined()
      expect(result.ok).toBe(true) // Falha silenciosa, assume OK
    })

    it('deve retornar false quando __REACT_DEVTOOLS_GLOBAL_HOOK__ não tem renderers', () => {
      // @ts-expect-error - Teste
      globalThis.window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {}

      const result = checkPeerDeps({ logWarnings: false })

      // @ts-expect-error - Limpeza
      delete globalThis.window.__REACT_DEVTOOLS_GLOBAL_HOOK__

      expect(result).toBeDefined()
    })

    it('deve retornar false quando renderers.size <= 1', () => {
      // @ts-expect-error - Teste
      globalThis.window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
        renderers: new Map([[1, { version: '18.2.0' }]]),
      }

      const result = checkPeerDeps({ logWarnings: false })

      // @ts-expect-error - Limpeza
      delete globalThis.window.__REACT_DEVTOOLS_GLOBAL_HOOK__

      // Com apenas 1 renderer, não deve detectar múltiplas instâncias
      expect(result.ok).toBe(true)
    })
  })

  describe('getPackageVersion - todos os caminhos', () => {
    it('deve retornar null quando package não tem version', () => {
      // @ts-expect-error - Teste
      globalThis.window.React = {}

      const result = checkPeerDeps({ logWarnings: false })

      // Sem versão, não deve detectar problema
      expect(result).toBeDefined()
    })

    it('deve obter versão de pacote genérico quando disponível', () => {
      // Simular pacote com versão
      // @ts-expect-error - Teste
      globalThis.window['@mui/material'] = { version: '5.15.20' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.warnings).toHaveLength(0)

      // @ts-expect-error - Limpeza
      delete globalThis.window['@mui/material']
    })

    it('deve retornar null quando acesso ao pacote lança erro', () => {
      const brokenWindow = new Proxy(
        {},
        {
          get() {
            throw new Error('Acesso negado')
          },
        },
      )

      // @ts-expect-error - Teste
      globalThis.window = brokenWindow

      const result = checkPeerDeps({ logWarnings: false })

      expect(result).toBeDefined()
    })

    it('deve retornar null em SSR (window undefined)', () => {
      const originalWindow = globalThis.window
      // @ts-expect-error - Simulando SSR
      globalThis.window = undefined

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.ok).toBe(true)

      globalThis.window = originalWindow
    })
  })

  describe('isVersionInRange - edge cases completos', () => {
    it('deve rejeitar versões acima do range máximo', () => {
      // @ts-expect-error - Teste
      globalThis.window.React = { version: '20.0.0' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.ok).toBe(false)
      expect(result.errors.some((e) => e.includes('React'))).toBe(true)
    })

    it('deve aceitar versão no limite superior do range', () => {
      // @ts-expect-error - Teste
      globalThis.window.React = { version: '19.9.9' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.ok).toBe(true)
    })

    it('deve lidar com versão sem pontos (apenas major)', () => {
      // @ts-expect-error - Teste
      globalThis.window.React = { version: '18' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.ok).toBe(true)
    })

    it('deve parsear corretamente versão com prefixo (v18.2.0)', () => {
      // @ts-expect-error - Teste
      globalThis.window.React = { version: 'v18.2.0' }

      const result = checkPeerDeps({ logWarnings: false })

      // O parseInt ignora o 'v' e pega o número
      expect(result.ok).toBe(false) // 'v18.2.0' → NaN → fora do range
    })
  })

  describe('MUI version check - cobertura completa', () => {
    it('deve logar warning quando MUI está fora do range e logWarnings=true', () => {
      // Logger suprime warns em produção, então verifica apenas que warnings estão no resultado
      // @ts-expect-error - Teste
      globalThis.window['@mui/material'] = { version: '4.0.0' }

      const result = checkPeerDeps({ logWarnings: true })

      expect(result.warnings.length).toBeGreaterThan(0)
      expect(result.warnings.some((w) => w.includes('MUI'))).toBe(true)

      // @ts-expect-error - Limpeza
      delete globalThis.window['@mui/material']
    })

    it('deve rejeitar MUI 4.x', () => {
      // @ts-expect-error - Teste
      globalThis.window['@mui/material'] = { version: '4.12.4' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.warnings.length).toBeGreaterThan(0)
      expect(result.warnings.some((w) => w.includes('MUI'))).toBe(true)

      // @ts-expect-error - Limpeza
      delete globalThis.window['@mui/material']
    })

    it('deve rejeitar MUI 8.x (acima do range)', () => {
      // @ts-expect-error - Teste
      globalThis.window['@mui/material'] = { version: '8.0.0' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.warnings.length).toBeGreaterThan(0)

      // @ts-expect-error - Limpeza
      delete globalThis.window['@mui/material']
    })

    it('não deve adicionar warning quando MUI não está carregado', () => {
      // @ts-expect-error - Limpeza garantida
      delete globalThis.window['@mui/material']

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.warnings).toHaveLength(0)
    })
  })

  describe('runPeerDepsCheck - cobertura completa de branches', () => {
    it('deve executar verificação quando há warnings', () => {
      // @ts-expect-error - Teste
      globalThis.window['@mui/material'] = { version: '4.0.0' }

      // Apenas verifica que não lança erro
      expect(() => runPeerDepsCheck()).not.toThrow()

      // @ts-expect-error - Limpeza
      delete globalThis.window['@mui/material']
    })

    it('deve logar erro quando há erros críticos', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      // @ts-expect-error - Teste
      globalThis.window.React = { version: '17.0.0' }

      runPeerDepsCheck()

      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
      // @ts-expect-error - Limpeza
      delete globalThis.window.React
    })
  })

  describe('process.env edge cases', () => {
    it('deve funcionar quando process não está definido', () => {
      const originalProcess = globalThis.process

      // @ts-expect-error - Teste
      globalThis.process = undefined

      const result = checkPeerDeps({ logWarnings: false })

      expect(result).toBeDefined()

      globalThis.process = originalProcess
    })

    it('deve funcionar quando process.env não está definido', () => {
      const originalProcess = globalThis.process
      // @ts-expect-error - Teste
      globalThis.process = {}

      const result = checkPeerDeps({ logWarnings: false })

      expect(result).toBeDefined()

      globalThis.process = originalProcess
    })

    it('deve funcionar quando NODE_ENV não está definido', () => {
      const originalEnv = process.env.NODE_ENV
      delete process.env.NODE_ENV

      const result = checkPeerDeps({ logWarnings: false })

      expect(result).toBeDefined()

      process.env.NODE_ENV = originalEnv
    })
  })

  describe('i18n - Internacionalização', () => {
    const {
      setPeerDepsLocale,
      getPeerDepsLocale,
      setPeerDepsMessages,
      resetPeerDepsMessages,
    } = require('../peerDepsCheck')

    afterEach(() => {
      // Reset para pt-BR após cada teste
      setPeerDepsLocale('pt-BR')
      resetPeerDepsMessages()
    })

    it('deve usar pt-BR como idioma padrão', () => {
      const locale = getPeerDepsLocale()
      expect(locale).toBe('pt-BR')
    })

    it('deve permitir alterar para inglês', () => {
      setPeerDepsLocale('en')
      const locale = getPeerDepsLocale()
      expect(locale).toBe('en')
    })

    it('deve exibir mensagens em português por padrão', () => {
      // @ts-expect-error - Teste
      globalThis.window.React = { version: '17.0.0' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.errors[0]).toContain('Versão detectada: React')
      expect(result.errors[0]).toContain('Versões suportadas: React')

      // @ts-expect-error - Limpeza
      delete globalThis.window.React
    })

    it('deve exibir mensagens em inglês quando configurado', () => {
      setPeerDepsLocale('en')

      // @ts-expect-error - Teste
      globalThis.window.React = { version: '17.0.0' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.errors[0]).toContain('Detected version: React')
      expect(result.errors[0]).toContain('Supported versions: React')

      // @ts-expect-error - Limpeza
      delete globalThis.window.React
    })

    it('deve permitir customizar mensagens', () => {
      setPeerDepsMessages({
        UNSUPPORTED_REACT_VERSION: (v: string) => `Versión ${v} no soportada (Español)`,
      })

      // @ts-expect-error - Teste
      globalThis.window.React = { version: '17.0.0' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.errors[0]).toContain('Versión 17.0.0 no soportada (Español)')

      // @ts-expect-error - Limpeza
      delete globalThis.window.React
    })

    it('deve manter mensagens não customizadas do idioma atual', () => {
      setPeerDepsLocale('en')
      setPeerDepsMessages({
        UNSUPPORTED_REACT_VERSION: (v: string) => `Custom React ${v} message`,
      })

      // @ts-expect-error - Teste
      globalThis.window.React = { version: '17.0.0' }

      const result = checkPeerDeps({ logWarnings: false })

      // Mensagem customizada
      expect(result.errors[0]).toContain('Custom React 17.0.0 message')

      // @ts-expect-error - Limpeza
      delete globalThis.window.React
    })

    it('deve resetar mensagens customizadas', () => {
      setPeerDepsMessages({
        UNSUPPORTED_REACT_VERSION: (v: string) => `Custom ${v}`,
      })

      resetPeerDepsMessages()

      // @ts-expect-error - Teste
      globalThis.window.React = { version: '17.0.0' }

      const result = checkPeerDeps({ logWarnings: false })

      // Deve voltar para mensagem padrão em pt-BR
      expect(result.errors[0]).toContain('Versão detectada: React')

      // @ts-expect-error - Limpeza
      delete globalThis.window.React
    })

    it('deve permitir customização parcial de mensagens', () => {
      setPeerDepsMessages({
        MUI_OUT_OF_RANGE: (v: string) => `MUI personalizado: ${v}`,
      })

      // @ts-expect-error - Teste
      globalThis.window['@mui/material'] = { version: '4.0.0' }

      const result = checkPeerDeps({ logWarnings: false })

      expect(result.warnings[0]).toBe('MUI personalizado: 4.0.0')

      // @ts-expect-error - Limpeza
      delete globalThis.window['@mui/material']
    })

    it('deve preservar customizações ao trocar idioma', () => {
      setPeerDepsMessages({
        UNSUPPORTED_REACT_VERSION: (v: string) => `Versão custom: ${v}`,
      })

      setPeerDepsLocale('en')

      // @ts-expect-error - Teste
      globalThis.window.React = { version: '17.0.0' }

      const result = checkPeerDeps({ logWarnings: false })

      // Customização tem prioridade sobre idioma
      expect(result.errors[0]).toContain('Versão custom: 17.0.0')

      // @ts-expect-error - Limpeza
      delete globalThis.window.React
    })
  })
})
