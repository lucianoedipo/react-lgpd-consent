import { analyzeDeveloperConfiguration, logDeveloperGuidance } from '../developerGuidance'

describe('developerGuidance utilities', () => {
  test('analyzeDeveloperConfiguration uses defaults when no config provided', () => {
    const guidance = analyzeDeveloperConfiguration()
    expect(guidance).toBeDefined()
    expect(guidance.usingDefaults).toBe(true)
    const ids = guidance.activeCategoriesInfo.map((c) => c.id)
    expect(ids).toEqual(expect.arrayContaining(['necessary', 'analytics']))
    expect(guidance.warnings.length).toBeGreaterThanOrEqual(1)
  })

  test('analyzeDeveloperConfiguration with empty enabledCategories suggests adding categories', () => {
    const guidance = analyzeDeveloperConfiguration({ enabledCategories: [] })
    expect(guidance.usingDefaults).toBe(false)
    expect(guidance.activeCategoriesInfo.map((c) => c.id)).toEqual(['necessary'])
    expect(guidance.suggestions.length).toBeGreaterThanOrEqual(1)
  })

  test('analyzeDeveloperConfiguration adiciona aviso quando ha muitas categorias opcionais', () => {
    const guidance = analyzeDeveloperConfiguration({
      enabledCategories: [
        'analytics',
        'marketing',
        'functional',
        'social',
        'personalization',
      ],
      customCategories: [
        {
          id: 'support',
          name: 'Cookies de Suporte',
          description: 'Atendimento e suporte ao usuario',
        },
      ],
    })

    const hasUsabilityWarning = guidance.messages.some(
      (msg) => msg.severity === 'warning' && msg.category === 'usability',
    )
    expect(hasUsabilityWarning).toBe(true)
  })

  test('logDeveloperGuidance writes to console when enabled and does not when disabled', () => {
    const guidance = analyzeDeveloperConfiguration()

    const groupSpy = jest.spyOn(console, 'group').mockImplementation(() => {})
    const groupEndSpy = jest.spyOn(console, 'groupEnd').mockImplementation(() => {})
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
    const tableSpy = jest.spyOn(console, 'table').mockImplementation(() => {})

    // Should print guidance (process.env.NODE_ENV in tests is 'test', not production)
    logDeveloperGuidance(guidance)

    expect(groupSpy).toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalled()
    expect(infoSpy).toHaveBeenCalled()
    // table is used to print active categories
    expect(tableSpy).toHaveBeenCalled()
    expect(groupEndSpy).toHaveBeenCalled()

    // Now should be silenced if disableGuidanceProp is true
    groupSpy.mockClear()
    warnSpy.mockClear()
    infoSpy.mockClear()
    tableSpy.mockClear()
    groupEndSpy.mockClear()

    logDeveloperGuidance(guidance, true)

    expect(groupSpy).not.toHaveBeenCalled()
    expect(warnSpy).not.toHaveBeenCalled()
    expect(infoSpy).not.toHaveBeenCalled()
    expect(tableSpy).not.toHaveBeenCalled()
    expect(groupEndSpy).not.toHaveBeenCalled()

    groupSpy.mockRestore()
    groupEndSpy.mockRestore()
    warnSpy.mockRestore()
    infoSpy.mockRestore()
    tableSpy.mockRestore()
  })

  test('logDeveloperGuidance usa messageProcessor e encerra sem logs', () => {
    const guidance = analyzeDeveloperConfiguration({
      enabledCategories: ['analytics', 'marketing'],
    })

    const messageProcessor = jest.fn()
    const groupSpy = jest.spyOn(console, 'group').mockImplementation(() => {})

    logDeveloperGuidance(guidance, false, { messageProcessor })

    expect(messageProcessor).toHaveBeenCalledWith(guidance.messages)
    expect(groupSpy).not.toHaveBeenCalled()

    groupSpy.mockRestore()
  })
})
