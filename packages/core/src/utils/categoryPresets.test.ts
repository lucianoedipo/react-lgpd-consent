import { createAnpdCategoriesConfig, ANPD_CATEGORY_PRESETS } from './categoryPresets'

describe('categoryPresets (ANPD)', () => {
  it('gera config padrão com analytics/functional/marketing', () => {
    const cfg = createAnpdCategoriesConfig()

    expect(cfg.enabledCategories).toEqual(['analytics', 'functional', 'marketing'])
    expect(cfg.customCategories).toBeUndefined()
  })

  it('permite selecionar categorias específicas e customizar texto', () => {
    const cfg = createAnpdCategoriesConfig({
      include: ['necessary', 'analytics'],
      descriptions: { necessary: 'Obrigatórios para operar' },
      names: { necessary: 'Essenciais' },
    })

    expect(cfg.enabledCategories).toEqual(['analytics'])
    expect(cfg.customCategories).toEqual([
      expect.objectContaining({
        id: 'necessary',
        name: 'Essenciais',
        description: 'Obrigatórios para operar',
        essential: true,
      }),
    ])
  })

  it('expoe presets tipados para reutilização', () => {
    expect(ANPD_CATEGORY_PRESETS.analytics.id).toBe('analytics')
    expect(ANPD_CATEGORY_PRESETS.marketing.essential).toBe(false)
    expect(ANPD_CATEGORY_PRESETS.necessary.essential).toBe(true)
  })
})
