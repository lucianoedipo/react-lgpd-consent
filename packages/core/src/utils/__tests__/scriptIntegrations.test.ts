import {
  createClarityIntegration,
  createFacebookPixelIntegration,
  createGoogleAnalyticsIntegration,
  createGoogleTagManagerIntegration,
  createHotjarIntegration,
  createIntercomIntegration,
  createMixpanelIntegration,
  createUserWayIntegration,
  createZendeskChatIntegration,
} from '../scriptIntegrations'

// Suprimir logs do developerGuidance durante estes testes
// console.* é suprimido globalmente em jest.setup.ts
afterAll(() => jest.restoreAllMocks())

describe('scriptIntegrations factories', () => {
  beforeEach(() => {
    // reset global window properties used by integrations
    ;(global as any).window = { dataLayer: [] }
    delete (global as any).gtag
  })

  test('google analytics integration seta consent mode default e gtag', () => {
    const ga = createGoogleAnalyticsIntegration({ measurementId: 'G-TEST' })
    expect(ga.id).toBe('google-analytics')
    expect(ga.category).toBe('analytics')
    expect(typeof ga.bootstrap).toBe('function')
    expect(typeof ga.onConsentUpdate).toBe('function')

    ga.bootstrap?.()
    expect((global as any).window.dataLayer).toBeDefined()
    const firstPush = (global as any).window.dataLayer[0]
    expect(firstPush[0]).toBe('consent')
    expect(firstPush[1]).toBe('default')

    ga.init?.()
    expect(typeof (global as any).window.gtag).toBe('function')

    ga.onConsentUpdate?.({
      consented: true,
      preferences: { necessary: true, analytics: true, marketing: true } as any,
    })
    const lastPush = (global as any).window.dataLayer.pop()
    expect(lastPush[0]).toBe('consent')
    expect(lastPush[1]).toBe('update')
    expect(lastPush[2]).toMatchObject({
      analytics_storage: 'granted',
      ad_storage: 'granted',
    })
  })

  test('google analytics bootstrap usa gtag existente quando já definido', () => {
    const gtag = jest.fn()
    ;(global as any).window.gtag = gtag

    const ga = createGoogleAnalyticsIntegration({ measurementId: 'G-TEST' })
    ga.bootstrap?.()

    expect(gtag).toHaveBeenCalledWith(
      'consent',
      'default',
      expect.objectContaining({
        analytics_storage: 'denied',
      }),
    )
  })

  test('google analytics bootstrap não falha sem window (SSR-safe)', () => {
    const originalWindow = (global as any).window
    // @ts-ignore - test mock window object
    delete (global as any).window

    const ga = createGoogleAnalyticsIntegration({ measurementId: 'G-TEST' })
    expect(() => ga.bootstrap?.()).not.toThrow()

    ;(global as any).window = originalWindow
  })

  test('permite sobrescrever categoria nas integrações', () => {
    const ga = createGoogleAnalyticsIntegration({
      measurementId: 'G-TEST',
      category: '  marketing  ',
    })
    const intercom = createIntercomIntegration({ app_id: 'app123', category: 'analytics' })

    expect(ga.category).toBe('marketing')
    expect(intercom.category).toBe('analytics')
  })

  test('google tag manager integration respeita dataLayer custom e consent mode', () => {
    const gtm = createGoogleTagManagerIntegration({
      containerId: 'GTM-ABC',
      dataLayerName: 'customLayer',
    })
    expect(gtm.id).toBe('google-tag-manager')
    expect(gtm.category).toBe('analytics')
    expect(typeof gtm.bootstrap).toBe('function')
    expect(typeof gtm.onConsentUpdate).toBe('function')

    gtm.bootstrap?.()
    expect((global as any).window.customLayer).toBeDefined()
    const firstPush = (global as any).window.customLayer[0]
    expect(firstPush[0]).toBe('consent')
    expect(firstPush[1]).toBe('default')

    // init mantém dataLayer e adiciona evento de bootstrap do GTM
    gtm.init?.()
    expect((global as any).window.customLayer.length).toBeGreaterThanOrEqual(2)

    gtm.onConsentUpdate?.({
      consented: true,
      preferences: { necessary: true, analytics: true, marketing: false } as any,
    })
    const lastPush = (global as any).window.customLayer.pop()
    expect(lastPush[1]).toBe('update')
    expect(lastPush[2]).toMatchObject({ analytics_storage: 'granted', ad_storage: 'denied' })
  })

  test('google tag manager init reaproveita dataLayer existente', () => {
    ;(global as any).window.customLayer = [{ event: 'preexisting' }]
    const gtm = createGoogleTagManagerIntegration({
      containerId: 'GTM-ABC',
      dataLayerName: 'customLayer',
    })

    gtm.init?.()
    expect((global as any).window.customLayer[0]).toMatchObject({ event: 'preexisting' })
  })

  test('google tag manager bootstrap não falha sem window (SSR-safe)', () => {
    const originalWindow = (global as any).window
    // @ts-ignore - test mock window object
    delete (global as any).window

    const gtm = createGoogleTagManagerIntegration({ containerId: 'GTM-ABC' })
    expect(() => gtm.bootstrap?.()).not.toThrow()
    expect(() => gtm.onConsentUpdate?.({ consented: true, preferences: {} as any })).not.toThrow()

    ;(global as any).window = originalWindow
  })

  test('userway integration sets UserWayWidgetApp and attrs', () => {
    const userway = createUserWayIntegration({ accountId: 'acct-123' })
    expect(userway.id).toBe('userway')
    expect(userway.category).toBe('functional')

    userway.init?.()
    expect((global as any).window.UserWayWidgetApp).toBeDefined()
    expect((global as any).window.UserWayWidgetApp.accountId).toBe('acct-123')
    expect(userway.attrs).toMatchObject({ 'data-account': 'acct-123' })
  })

  test('facebook pixel integration initializes fbq and tracks PageView by default', () => {
    const fb = createFacebookPixelIntegration({ pixelId: '123' })
    expect(fb.id).toBe('facebook-pixel')
    expect(fb.category).toBe('marketing')
    fb.init?.()
    expect((global as any).window.fbq).toBeDefined()
  })

  test('facebook pixel uses callMethod when available', () => {
    const fb = createFacebookPixelIntegration({ pixelId: '123' })
    fb.init?.()

    const callMethod = jest.fn()
    ;(global as any).window.fbq.callMethod = callMethod
    ;(global as any).window.fbq('track', 'Purchase')

    expect(callMethod).toHaveBeenCalledWith('track', 'Purchase')
  })

  test('facebook pixel integration skips PageView when autoTrack=false', () => {
    const fb = createFacebookPixelIntegration({ pixelId: '123', autoTrack: false })
    const fbq = jest.fn()
    ;(global as any).window.fbq = fbq
    fb.init?.()
    expect(fbq).toHaveBeenCalledTimes(1)
    expect(fbq).toHaveBeenCalledWith('init', '123', {})
  })

  test('hotjar integration defines hj queue and settings', () => {
    const hj = createHotjarIntegration({ siteId: '999', version: 6, debug: true })
    expect(hj.id).toBe('hotjar')
    expect(hj.category).toBe('analytics')
    hj.init?.()
    expect((global as any).window._hjSettings).toBeDefined()
    expect(typeof (global as any).window.hj).toBe('function')
  })

  test('hotjar queue captures events when hj is invoked', () => {
    const hj = createHotjarIntegration({ siteId: '777', version: 6 })
    hj.init?.()
    ;(global as any).window.hj('event', 'signup')

    expect((global as any).window.hj.q).toHaveLength(1)
  })

  test('hotjar integration logs info when debug=true', () => {
    const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => undefined)
    const hj = createHotjarIntegration({ siteId: '888', debug: true })
    hj.init?.()
    expect(infoSpy).toHaveBeenCalledWith('[Hotjar] initialized with siteId', '888')
    infoSpy.mockRestore()
  })

  test('mixpanel integration sets mixpanel and calls init', () => {
    const m = createMixpanelIntegration({ token: 'tok' })
    expect(m.id).toBe('mixpanel')
    expect(m.category).toBe('analytics')
    m.init?.()
    expect((global as any).window.mixpanel).toBeDefined()
  })

  test('mixpanel integration no-ops quando init não é função', () => {
    const m = createMixpanelIntegration({ token: 'tok' })
    ;(global as any).window.mixpanel = {}

    expect(() => m.init?.()).not.toThrow()
  })

  test('clarity integration no-ops when upload is undefined', () => {
    const c = createClarityIntegration({ projectId: 'abc123' })
    ;(global as any).window.clarity = jest.fn()
    c.init?.()
    expect((global as any).window.clarity).not.toHaveBeenCalled()
  })

  test('clarity integration calls clarity set when upload is configured', () => {
    const c = createClarityIntegration({ projectId: 'abc123', upload: false })
    expect(c.id).toBe('clarity')
    expect(c.category).toBe('analytics')
    expect(c.src).toBe('https://www.clarity.ms/tag/abc123')

    // Mock clarity function
    ;(global as any).window.clarity = jest.fn()
    c.init?.()
    expect((global as any).window.clarity).toHaveBeenCalledWith('set', 'upload', false)
  })

  test('clarity integration ignora quando clarity não é função', () => {
    const c = createClarityIntegration({ projectId: 'abc123', upload: true })
    ;(global as any).window.clarity = {}

    expect(() => c.init?.()).not.toThrow()
  })

  test('intercom integration boots with app_id', () => {
    const i = createIntercomIntegration({ app_id: 'xyz789' })
    expect(i.id).toBe('intercom')
    expect(i.category).toBe('functional')

    // Mock Intercom function
    ;(global as any).window.Intercom = jest.fn()
    i.init?.()
    expect((global as any).window.Intercom).toHaveBeenCalledWith('boot', { app_id: 'xyz789' })
  })

  test('zendesk integration identifies with key', () => {
    const z = createZendeskChatIntegration({ key: 'key123' })
    expect(z.id).toBe('zendesk-chat')
    expect(z.category).toBe('functional')

    // Mock zE function
    ;(global as any).window.zE = jest.fn()
    z.init?.()
    expect((global as any).window.zE).toHaveBeenCalledWith('webWidget', 'identify', {
      key: 'key123',
    })
  })
})
