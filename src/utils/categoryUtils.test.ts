import {
  createProjectPreferences,
  validateProjectPreferences,
  getAllProjectCategories,
  validateCategoriesConfig,
} from './categoryUtils'

// Suprimir logs do developerGuidance durante estes testes
let __logSpy: jest.SpyInstance, __infoSpy: jest.SpyInstance, __groupSpy: jest.SpyInstance, __warnSpy: jest.SpyInstance, __errorSpy: jest.SpyInstance

beforeAll(() => {
  __logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
  __infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
  __groupSpy = jest.spyOn(console, 'group').mockImplementation(() => {})
  __warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  __errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  __logSpy.mockRestore()
  __infoSpy.mockRestore()
  __groupSpy.mockRestore()
  __warnSpy.mockRestore()
  __errorSpy.mockRestore()
})

describe('categoryUtils', () => {
  test('createProjectPreferences returns necessary by default', () => {
    const prefs = createProjectPreferences()
    expect(prefs).toEqual({ necessary: true })
  })

  test('createProjectPreferences includes enabled categories with default false', () => {
    const prefs = createProjectPreferences({ enabledCategories: ['analytics', 'marketing'] })
    expect(prefs).toEqual({ necessary: true, analytics: false, marketing: false })
  })

  test('createProjectPreferences can set defaultValue true', () => {
    const prefs = createProjectPreferences({ enabledCategories: ['analytics'] }, true)
    expect(prefs).toEqual({ necessary: true, analytics: true })
  })

  test('validateProjectPreferences removes unknown categories', () => {
    const saved = { necessary: true, analytics: true, oldCategory: false }
    const valid = validateProjectPreferences(saved as any, { enabledCategories: ['analytics'] })
    expect(valid).toEqual({ necessary: true, analytics: true })
  })

  test('getAllProjectCategories returns necessary plus enabled ones', () => {
    const list = getAllProjectCategories({ enabledCategories: ['analytics'] })
    const ids = list.map((c) => c.id)
    expect(ids).toContain('necessary')
    expect(ids).toContain('analytics')
  })

  test('validateCategoriesConfig reports invalid default categories', () => {
    // for test purposes cast to any to allow an invalid category string
    const errors = validateCategoriesConfig({ enabledCategories: ['invalid', 'analytics'] } as any)
    expect(errors).toContain('Categoria padrão inválida: invalid')
  })
})
