/**
 * @file autoConfigureCategories.test.ts
 * @description Testes para o sistema de auto-configuração de categorias
 * @since 0.4.1
 */

import type { Category } from '../types/types'
import {
  analyzeIntegrationCategories,
  autoConfigureCategories,
  extractCategoriesFromIntegrations,
  validateIntegrationCategories,
  validateNecessaryClassification,
} from './autoConfigureCategories'
import {
  createFacebookPixelIntegration,
  createGoogleAnalyticsIntegration,
  createGoogleTagManagerIntegration,
  createHotjarIntegration,
} from './scriptIntegrations'

// Mock console para capturar warnings/info
const mockConsole = {
  warn: jest.fn(),
  info: jest.fn(),
  group: jest.fn(),
  groupEnd: jest.fn(),
}

const originalConsole = {
  warn: console.warn,
  info: console.info,
  group: console.group,
  groupEnd: console.groupEnd,
}

beforeEach(() => {
  console.warn = mockConsole.warn
  console.info = mockConsole.info
  console.group = mockConsole.group
  console.groupEnd = mockConsole.groupEnd

  // Limpa mocks
  jest.clearAllMocks()
})

afterEach(() => {
  console.warn = originalConsole.warn
  console.info = originalConsole.info
  console.group = originalConsole.group
  console.groupEnd = originalConsole.groupEnd
})

describe('analyzeIntegrationCategories', () => {
  it('deve mapear integrações para suas categorias corretamente', () => {
    const integrations = [
      createGoogleAnalyticsIntegration({ measurementId: 'GA_MEASUREMENT_ID' }),
      createGoogleTagManagerIntegration({ containerId: 'GTM-XXXXX' }),
      createFacebookPixelIntegration({ pixelId: '123456789' }),
    ]

    const result = analyzeIntegrationCategories(integrations)

    expect(result).toEqual({
      analytics: ['google-analytics', 'google-tag-manager'],
      marketing: ['facebook-pixel'],
    })
  })

  it('deve lidar com múltiplas integrações da mesma categoria', () => {
    const integrations = [
      createGoogleAnalyticsIntegration({ measurementId: 'GA1' }),
      createHotjarIntegration({ siteId: '123' }),
      createGoogleTagManagerIntegration({ containerId: 'GTM1' }),
    ]

    const result = analyzeIntegrationCategories(integrations)

    expect(result).toEqual({
      analytics: ['google-analytics', 'hotjar', 'google-tag-manager'],
    })
  })

  it('deve retornar objeto vazio para array vazio', () => {
    const result = analyzeIntegrationCategories([])
    expect(result).toEqual({})
  })
})

describe('validateIntegrationCategories', () => {
  it('deve retornar true quando todas as categorias estão habilitadas', () => {
    const integrations = [
      createGoogleAnalyticsIntegration({ measurementId: 'GA_ID' }),
      createFacebookPixelIntegration({ pixelId: 'FB_ID' }),
    ]

    const result = validateIntegrationCategories(integrations, ['analytics', 'marketing'])
    expect(result).toBe(true)
  })

  it('deve retornar false quando alguma categoria está faltando', () => {
    const integrations = [
      createGoogleAnalyticsIntegration({ measurementId: 'GA_ID' }),
      createFacebookPixelIntegration({ pixelId: 'FB_ID' }),
    ]

    const result = validateIntegrationCategories(integrations, ['analytics'])
    expect(result).toBe(false)
  })

  it('deve retornar true para array vazio de integrações', () => {
    const result = validateIntegrationCategories([], ['analytics'])
    expect(result).toBe(true)
  })
})

describe('extractCategoriesFromIntegrations', () => {
  it('deve extrair categorias únicas', () => {
    const integrations = [
      createGoogleAnalyticsIntegration({ measurementId: 'GA1' }),
      createGoogleTagManagerIntegration({ containerId: 'GTM1' }),
      createFacebookPixelIntegration({ pixelId: 'FB1' }),
      createHotjarIntegration({ siteId: 'HJ1' }),
    ]

    const result = extractCategoriesFromIntegrations(integrations)
    const sortedResult = [...result].sort((a, b) => a.localeCompare(b))
    expect(sortedResult).toEqual(['analytics', 'marketing'])
  })

  it('deve remover duplicatas', () => {
    const integrations = [
      createGoogleAnalyticsIntegration({ measurementId: 'GA1' }),
      createGoogleAnalyticsIntegration({ measurementId: 'GA2' }),
      createHotjarIntegration({ siteId: 'HJ1' }),
    ]

    const result = extractCategoriesFromIntegrations(integrations)
    expect(result).toEqual(['analytics'])
  })

  it('deve retornar array vazio para array vazio', () => {
    const result = extractCategoriesFromIntegrations([])
    expect(result).toEqual([])
  })
})

describe('autoConfigureCategories', () => {
  beforeEach(() => {
    // Simula ambiente de desenvolvimento
    process.env.NODE_ENV = 'development'
  })

  afterEach(() => {
    process.env.NODE_ENV = 'test'
  })

  it('deve auto-habilitar categorias em falta', () => {
    const integrations = [
      createGoogleAnalyticsIntegration({ measurementId: 'GA_ID' }),
      createFacebookPixelIntegration({ pixelId: 'FB_ID' }),
    ]

    const result = autoConfigureCategories({ enabledCategories: ['analytics'] }, integrations, {
      warningOnly: false,
      silent: true,
    })

    expect(result.wasAdjusted).toBe(true)
    expect(result.autoEnabledCategories).toEqual(['marketing'])
    expect(result.adjustedConfig.enabledCategories).toContain('marketing')
    expect(result.adjustedConfig.enabledCategories).toContain('analytics')
  })

  it('deve apenas avisar quando warningOnly é true', () => {
    const integrations = [
      createGoogleAnalyticsIntegration({ measurementId: 'GA_ID' }),
      createFacebookPixelIntegration({ pixelId: 'FB_ID' }),
    ]

    const result = autoConfigureCategories({ enabledCategories: ['analytics'] }, integrations, {
      warningOnly: true,
      silent: false,
    })

    expect(result.wasAdjusted).toBe(false)
    expect(result.autoEnabledCategories).toEqual([])
    expect(result.missingCategories).toEqual(['marketing'])
    expect(mockConsole.warn).toHaveBeenCalled()
  })

  it('deve não fazer nada quando todas as categorias estão habilitadas', () => {
    const integrations = [createGoogleAnalyticsIntegration({ measurementId: 'GA_ID' })]

    const result = autoConfigureCategories({ enabledCategories: ['analytics'] }, integrations, {
      warningOnly: false,
      silent: true,
    })

    expect(result.wasAdjusted).toBe(false)
    expect(result.autoEnabledCategories).toEqual([])
    expect(result.adjustedConfig).toEqual({ enabledCategories: ['analytics'] })
  })

  it('deve usar configuração padrão quando não fornecida', () => {
    const integrations = [createFacebookPixelIntegration({ pixelId: 'FB_ID' })]

    const result = autoConfigureCategories(undefined, integrations, {
      warningOnly: false,
      silent: true,
    })

    expect(result.originalConfig).toEqual({ enabledCategories: ['analytics'] })
    expect(result.wasAdjusted).toBe(true)
    expect(result.autoEnabledCategories).toEqual(['marketing'])
  })

  it('deve logar informações quando silent é false e categorias são auto-habilitadas', () => {
    const integrations = [createFacebookPixelIntegration({ pixelId: 'FB_ID' })]

    autoConfigureCategories({ enabledCategories: ['analytics'] }, integrations, {
      warningOnly: false,
      silent: false,
    })

    expect(mockConsole.group).toHaveBeenCalledWith(
      expect.stringContaining('Categorias Auto-Habilitadas'),
    )
    expect(mockConsole.info).toHaveBeenCalled()
  })

  it('deve incluir mapeamento de integrações por categoria', () => {
    const integrations = [
      createGoogleAnalyticsIntegration({ measurementId: 'GA_ID' }),
      createGoogleTagManagerIntegration({ containerId: 'GTM_ID' }),
      createFacebookPixelIntegration({ pixelId: 'FB_ID' }),
    ]

    const result = autoConfigureCategories({ enabledCategories: [] }, integrations, {
      warningOnly: false,
      silent: true,
    })

    expect(result.categoryIntegrations).toEqual({
      analytics: ['google-analytics', 'google-tag-manager'],
      marketing: ['facebook-pixel'],
    })
  })
})

describe('ConsentScriptLoader Integration', () => {
  it('deve funcionar com ConsentScriptLoader em modo development', () => {
    // Este teste verifica que as funções podem ser usadas no contexto do ConsentScriptLoader
    const integrations = [
      createGoogleAnalyticsIntegration({ measurementId: 'GA_ID' }),
      createFacebookPixelIntegration({ pixelId: 'FB_ID' }),
    ]

    const enabledCategories = ['analytics'] as Category[] // simulando categories.allCategories.map(cat => cat.id)

    const isValid = validateIntegrationCategories(integrations, enabledCategories)
    expect(isValid).toBe(false)

    // Simula a chamada que seria feita no ConsentScriptLoader
    const result = autoConfigureCategories({ enabledCategories }, integrations, {
      warningOnly: true,
      silent: false,
    })

    expect(result.missingCategories).toEqual(['marketing'])
    expect(mockConsole.warn).toHaveBeenCalled()
  })
})

describe('validateNecessaryClassification', () => {
  it('deve retornar warnings para scripts conhecidos classificados incorretamente', () => {
    const integrations = [
      createGoogleAnalyticsIntegration({ measurementId: 'GA_ID' }),
      createFacebookPixelIntegration({ pixelId: 'FB_ID' }),
    ]

    // Simula categorias incluindo 'necessary' (perigoso!)
    const enabledCategories = ['necessary', 'analytics', 'marketing'] as Category[]

    const warnings = validateNecessaryClassification(integrations, enabledCategories)

    expect(warnings).toHaveLength(6) // 1 header + 2 scripts + 3 recommendations
    expect(warnings[0]).toContain('ATENÇÃO GDPR/LGPD')
    expect(warnings[1]).toContain('google-analytics')
    expect(warnings[2]).toContain('facebook-pixel')
    expect(warnings[3]).toContain("Scripts 'necessary' executam SEM consentimento")
    expect(warnings[4]).toContain('segurança, autenticação ou core do site')
    expect(warnings[5]).toContain('Mova estes scripts para categorias apropriadas')
  })

  it('deve retornar array vazio quando não há categoria necessary', () => {
    const integrations = [
      createGoogleAnalyticsIntegration({ measurementId: 'GA_ID' }),
      createFacebookPixelIntegration({ pixelId: 'FB_ID' }),
    ]

    const enabledCategories = ['analytics', 'marketing'] as Category[]

    const warnings = validateNecessaryClassification(integrations, enabledCategories)

    expect(warnings).toEqual([])
  })

  it('deve retornar array vazio para scripts customizados (não na lista proibida)', () => {
    const customIntegrations = [
      {
        id: 'custom-security-script',
        category: 'necessary' as Category,
        src: 'https://example.com/security.js',
      },
    ]

    const enabledCategories = ['necessary'] as Category[]

    const warnings = validateNecessaryClassification(customIntegrations, enabledCategories)

    expect(warnings).toEqual([])
  })

  it('deve identificar múltiplos scripts problemáticos', () => {
    const integrations = [
      createGoogleAnalyticsIntegration({ measurementId: 'GA_ID' }),
      createHotjarIntegration({ siteId: 'HJ_ID' }),
      createFacebookPixelIntegration({ pixelId: 'FB_ID' }),
    ]

    const enabledCategories = ['necessary', 'analytics', 'marketing'] as Category[]

    const warnings = validateNecessaryClassification(integrations, enabledCategories)

    expect(warnings).toHaveLength(7) // 1 header + 3 scripts + 3 recommendations
    expect(warnings.some((w) => w.includes('google-analytics'))).toBe(true)
    expect(warnings.some((w) => w.includes('hotjar'))).toBe(true)
    expect(warnings.some((w) => w.includes('facebook-pixel'))).toBe(true)
  })

  it('deve funcionar com array vazio de integrações', () => {
    const warnings = validateNecessaryClassification([], ['necessary'] as Category[])
    expect(warnings).toEqual([])
  })
})
