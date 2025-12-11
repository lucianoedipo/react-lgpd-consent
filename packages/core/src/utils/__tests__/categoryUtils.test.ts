import {
  createProjectPreferences,
  validateProjectPreferences,
  getAllProjectCategories,
  validateCategoriesConfig,
} from '../categoryUtils'

// Suprimir logs do developerGuidance durante estes testes
// console.* é suprimido globalmente em jest.setup.ts
afterAll(() => jest.restoreAllMocks())

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

  test('createProjectPreferences includes customCategories with default false', () => {
    const prefs = createProjectPreferences({
      enabledCategories: ['analytics'],
      customCategories: [
        { id: 'chat', name: 'Chat de Suporte', description: 'Widget de chat' },
        { id: 'video', name: 'Vídeo', description: 'Players de vídeo' },
      ],
    })
    expect(prefs).toEqual({ necessary: true, analytics: false, chat: false, video: false })
  })

  test('validateProjectPreferences keeps only enabled and custom categories', () => {
    const saved = {
      necessary: true,
      analytics: true,
      chat: true,
      unknownX: true,
    }
    const valid = validateProjectPreferences(saved as any, {
      enabledCategories: ['analytics'],
      customCategories: [{ id: 'chat', name: 'Chat', description: 'Suporte' }],
    })
    expect(valid).toEqual({ necessary: true, analytics: true, chat: true })
  })

  test('getAllProjectCategories merges customCategories with names/descriptions', () => {
    const list = getAllProjectCategories({
      enabledCategories: ['functional'],
      customCategories: [
        { id: 'abTesting', name: 'AB Testing', description: 'Experimentos de UI' },
      ],
    })
    const map = Object.fromEntries(list.map((c) => [c.id, c]))
    expect(map.necessary).toBeDefined()
    expect(map.functional).toBeDefined()
    expect(map.abTesting).toBeDefined()
    expect(map.abTesting.name).toBe('AB Testing')
    expect(map.abTesting.description).toBe('Experimentos de UI')
  })

  test('validateCategoriesConfig reports invalid default categories', () => {
    // for test purposes cast to any to allow an invalid category string
    const errors = validateCategoriesConfig({ enabledCategories: ['invalid', 'analytics'] } as any)
    expect(errors).toContain('Categoria padrão inválida: invalid')
  })

  // Edge cases para customCategories
  test('createProjectPreferences ignores customCategories with empty id', () => {
    const prefs = createProjectPreferences({
      customCategories: [
        { id: '', name: 'Empty ID', description: 'Should be ignored' },
        { id: 'valid', name: 'Valid', description: 'Should be included' },
      ],
    })
    expect(prefs).toEqual({ necessary: true, valid: false })
  })

  test('createProjectPreferences ignores customCategories with necessary id', () => {
    const prefs = createProjectPreferences({
      customCategories: [
        { id: 'necessary', name: 'Override', description: 'Should be ignored' },
        { id: 'valid', name: 'Valid', description: 'Should be included' },
      ],
    })
    expect(prefs).toEqual({ necessary: true, valid: false })
  })

  test('getAllProjectCategories handles customCategories with essential flag', () => {
    const list = getAllProjectCategories({
      customCategories: [
        {
          id: 'essential-custom',
          name: 'Essential',
          description: 'Essential custom',
          essential: true,
        },
        {
          id: 'optional-custom',
          name: 'Optional',
          description: 'Optional custom',
          essential: false,
        },
      ],
    })
    const essentialCustom = list.find((c) => c.id === 'essential-custom')
    const optionalCustom = list.find((c) => c.id === 'optional-custom')

    expect(essentialCustom?.essential).toBe(true)
    expect(optionalCustom?.essential).toBe(false)
  })

  test('validateProjectPreferences handles empty config gracefully', () => {
    const saved = { necessary: true, analytics: true, custom: false }
    const valid = validateProjectPreferences(saved as any)
    expect(valid).toEqual({ necessary: true })
  })

  test('createProjectPreferences with defaultValue true sets custom categories correctly', () => {
    const prefs = createProjectPreferences(
      {
        enabledCategories: ['analytics'],
        customCategories: [{ id: 'chat', name: 'Chat', description: 'Support chat' }],
      },
      true,
    )
    expect(prefs).toEqual({ necessary: true, analytics: true, chat: true })
  })
})
