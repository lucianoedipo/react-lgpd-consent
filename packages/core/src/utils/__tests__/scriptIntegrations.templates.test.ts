import {
  createCorporateIntegrations,
  createECommerceIntegrations,
  createSaaSIntegrations,
  INTEGRATION_TEMPLATES,
} from '../scriptIntegrations'

describe('template functions', () => {
  test('createECommerceIntegrations creates array with provided configs', () => {
    const result = createECommerceIntegrations({
      googleAnalytics: { measurementId: 'G-TEST' },
      facebookPixel: { pixelId: '123' },
    })

    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('google-analytics')
    expect(result[1].id).toBe('facebook-pixel')
  })

  test('createECommerceIntegrations inclui integrações opcionais quando fornecidas', () => {
    const result = createECommerceIntegrations({
      googleAnalytics: { measurementId: 'G-TEST' },
      facebookPixel: { pixelId: '123' },
      hotjar: { siteId: '999' },
      userway: { accountId: 'ACC' },
    })

    expect(result).toHaveLength(4)
    expect(result.map((i) => i.id)).toEqual(
      expect.arrayContaining(['google-analytics', 'facebook-pixel', 'hotjar', 'userway']),
    )
  })

  test('createSaaSIntegrations creates array with provided configs', () => {
    const result = createSaaSIntegrations({
      mixpanel: { token: 'tok' },
      intercom: { app_id: 'app123' },
    })

    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('mixpanel')
    expect(result[1].id).toBe('intercom')
  })

  test('createSaaSIntegrations retorna array vazio quando nenhuma config é fornecida', () => {
    const result = createSaaSIntegrations({})
    expect(result).toEqual([])
  })

  test('createCorporateIntegrations creates array with provided configs', () => {
    const result = createCorporateIntegrations({
      googleAnalytics: { measurementId: 'G-CORP' },
      clarity: { projectId: 'clarity123' },
    })

    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('google-analytics')
    expect(result[1].id).toBe('clarity')
  })

  test('createCorporateIntegrations inclui integrações opcionais quando fornecidas', () => {
    const result = createCorporateIntegrations({
      googleAnalytics: { measurementId: 'G-CORP' },
      clarity: { projectId: 'clarity123' },
      zendesk: { key: 'key123' },
      userway: { accountId: 'ACC' },
    })

    expect(result).toHaveLength(4)
    expect(result.map((i) => i.id)).toEqual(
      expect.arrayContaining(['google-analytics', 'clarity', 'zendesk-chat', 'userway']),
    )
  })

  test('INTEGRATION_TEMPLATES contains correct structure', () => {
    expect(INTEGRATION_TEMPLATES.ecommerce.essential).toContain('google-analytics')
    expect(INTEGRATION_TEMPLATES.ecommerce.essential).toContain('facebook-pixel')
    expect(INTEGRATION_TEMPLATES.saas.essential).toContain('mixpanel')
    expect(INTEGRATION_TEMPLATES.corporate.optional).toContain('zendesk-chat')
  })
})
