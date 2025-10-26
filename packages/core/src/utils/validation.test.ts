import { validateConsentProviderProps } from './validation'

describe('validateConsentProviderProps', () => {
  let originalEnv: string | undefined
  let consoleWarnSpy: jest.SpyInstance
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
    consoleWarnSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  test('returns warnings when categories is undefined', () => {
    const result = validateConsentProviderProps({})

    expect(result.warnings.some((w) => w.includes("Prop 'categories' não fornecida"))).toBe(true)
    // Pode haver erros do Zod também (quando disponível)
  })

  test('sanitizes "necessary" from enabledCategories', () => {
    const result = validateConsentProviderProps({
      categories: {
        enabledCategories: ['necessary', 'analytics', 'marketing'],
      },
    })

    expect(result.sanitized.categories?.enabledCategories).toEqual(['analytics', 'marketing'])
    expect(
      result.warnings.some((w) => w.includes("'necessary' é sempre incluída automaticamente")),
    ).toBe(true)
  })

  test('detects duplicate category IDs', () => {
    const result = validateConsentProviderProps({
      categories: {
        enabledCategories: ['analytics', 'marketing', 'analytics'],
        customCategories: [
          { id: 'custom1', name: 'Custom', description: 'Desc' },
          { id: 'custom1', name: 'Custom2', description: 'Desc2' },
        ],
      },
    })

    expect(result.warnings.some((w) => w.includes('IDs de categoria duplicados'))).toBe(true)
    expect(result.warnings.some((w) => w.includes('custom1'))).toBe(true)
  })

  test('detects invalid enabledCategories values', () => {
    const result = validateConsentProviderProps({
      categories: {
        enabledCategories: ['analytics', '', '  ', 'marketing'] as any,
      },
    })

    expect(result.warnings.some((w) => w.includes('valores inválidos'))).toBe(true)
  })

  test('validates customCategories schema with Zod', () => {
    const result = validateConsentProviderProps({
      categories: {
        enabledCategories: ['analytics'],
        customCategories: [
          { id: '', name: 'Invalid', description: 'Test' }, // ID vazio
          { id: 'valid', name: '', description: 'Test' }, // Name vazio
        ] as any,
      },
    })

    // Se Zod estiver disponível, deve detectar erros
    expect(result.errors.length > 0 || result.warnings.length > 0).toBe(true)
  })

  test('handles valid categories configuration', () => {
    const result = validateConsentProviderProps({
      categories: {
        enabledCategories: ['analytics', 'marketing'],
        customCategories: [
          {
            id: 'custom1',
            name: 'Custom Category',
            description: 'Custom description',
            essential: false,
            cookies: ['cookie1', 'cookie2'],
          },
        ],
      },
    })

    expect(result.sanitized.categories?.enabledCategories).toEqual(['analytics', 'marketing'])
    expect(result.sanitized.categories?.customCategories).toHaveLength(1)
    expect(result.warnings).toEqual([])
    expect(result.errors).toEqual([])
  })

  test('production mode skips heavy validation', () => {
    process.env.NODE_ENV = 'production'

    const result = validateConsentProviderProps({
      categories: {
        enabledCategories: ['necessary', 'analytics'],
        customCategories: [{ id: '', name: '', description: '' }] as any, // Inválido
      },
    })

    // Em produção, só sanitiza 'necessary', não valida schema
    expect(result.sanitized.categories?.enabledCategories).toEqual(['analytics'])
    expect(result.warnings).toEqual([])
    expect(result.errors).toEqual([])
  })

  test('production mode handles undefined categories', () => {
    process.env.NODE_ENV = 'production'

    const result = validateConsentProviderProps({})

    expect(result.sanitized.categories).toBeUndefined()
    expect(result.warnings).toEqual([])
    expect(result.errors).toEqual([])
  })

  test('deduplicates enabled categories', () => {
    const result = validateConsentProviderProps({
      categories: {
        enabledCategories: ['analytics', 'marketing', 'analytics', 'marketing'],
      },
    })

    expect(result.sanitized.categories?.enabledCategories).toEqual(['analytics', 'marketing'])
  })

  test('handles empty enabledCategories array', () => {
    const result = validateConsentProviderProps({
      categories: {
        enabledCategories: [],
      },
    })

    expect(result.sanitized.categories?.enabledCategories).toEqual([])
    expect(result.warnings).toEqual([])
  })

  test('handles customCategories without optional fields', () => {
    const result = validateConsentProviderProps({
      categories: {
        enabledCategories: ['analytics'],
        customCategories: [
          {
            id: 'custom1',
            name: 'Custom',
            description: 'Description',
            // essential e cookies são opcionais
          },
        ],
      },
    })

    expect(result.sanitized.categories?.customCategories).toHaveLength(1)
    expect(result.warnings).toEqual([])
    expect(result.errors).toEqual([])
  })

  test('detects duplicate between enabled and custom categories', () => {
    const result = validateConsentProviderProps({
      categories: {
        enabledCategories: ['analytics'],
        customCategories: [{ id: 'analytics', name: 'Analytics', description: 'Desc' }],
      },
    })

    expect(result.warnings.some((w) => w.includes('IDs de categoria duplicados'))).toBe(true)
    expect(result.warnings.some((w) => w.includes('analytics'))).toBe(true)
  })

  test('detects duplicate with "necessary" in custom categories', () => {
    const result = validateConsentProviderProps({
      categories: {
        enabledCategories: ['analytics'],
        customCategories: [{ id: 'necessary', name: 'Necessary', description: 'Desc' }],
      },
    })

    expect(result.warnings.some((w) => w.includes('IDs de categoria duplicados'))).toBe(true)
    expect(result.warnings.some((w) => w.includes('necessary'))).toBe(true)
  })
})
