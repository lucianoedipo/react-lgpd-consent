import {
  createGoogleAnalyticsIntegration,
  createGoogleTagManagerIntegration,
  createUserWayIntegration,
  createFacebookPixelIntegration,
  createHotjarIntegration,
  createMixpanelIntegration,
} from './scriptIntegrations'

// Suprimir logs do developerGuidance durante estes testes
// console.* é suprimido globalmente em jest.setup.ts
afterAll(() => jest.restoreAllMocks())

describe('scriptIntegrations factories', () => {
  beforeEach(() => {
    // reset global window properties used by integrations
    delete (global as any).window
    ;(global as any).window = {}
  })

  test('google analytics integration sets window.gtag and dataLayer', () => {
    const ga = createGoogleAnalyticsIntegration({ measurementId: 'G-TEST' })
    expect(ga.id).toBe('google-analytics')
    expect(ga.category).toBe('analytics')

    // call init and assert side effects
    ga.init && ga.init()
    expect((global as any).window.dataLayer).toBeDefined()
    expect(typeof (global as any).window.gtag).toBe('function')
  })

  test('google tag manager integration pushes to dataLayer', () => {
    const gtm = createGoogleTagManagerIntegration({ containerId: 'GTM-ABC' })
    expect(gtm.id).toBe('google-tag-manager')
    expect(gtm.category).toBe('analytics')

    gtm.init && gtm.init()
    expect((global as any).window.dataLayer).toBeDefined()
    expect((global as any).window.dataLayer.length).toBeGreaterThanOrEqual(1)
  })

  test('userway integration sets UserWayWidgetApp and attrs', () => {
    const userway = createUserWayIntegration({ accountId: 'acct-123' })
    expect(userway.id).toBe('userway')
    expect(userway.category).toBe('functional')

    userway.init && userway.init()
    expect((global as any).window.UserWayWidgetApp).toBeDefined()
    expect((global as any).window.UserWayWidgetApp.accountId).toBe('acct-123')
    expect(userway.attrs).toMatchObject({ 'data-account': 'acct-123' })
  })

  test('facebook pixel integration initializes fbq and tracks PageView by default', () => {
    const fb = createFacebookPixelIntegration({ pixelId: '123' })
    expect(fb.id).toBe('facebook-pixel')
    expect(fb.category).toBe('marketing')
    fb.init && fb.init()
    expect((global as any).window.fbq).toBeDefined()
  })

  test('hotjar integration defines hj queue and settings', () => {
    const hj = createHotjarIntegration({ siteId: '999', version: 6, debug: true })
    expect(hj.id).toBe('hotjar')
    expect(hj.category).toBe('analytics')
    hj.init && hj.init()
    expect((global as any).window._hjSettings).toBeDefined()
    expect(typeof (global as any).window.hj).toBe('function')
  })

  test('mixpanel integration sets mixpanel and calls init', () => {
    const m = createMixpanelIntegration({ token: 'tok' })
    expect(m.id).toBe('mixpanel')
    expect(m.category).toBe('analytics')
    m.init && m.init()
    expect((global as any).window.mixpanel).toBeDefined()
  })
})
